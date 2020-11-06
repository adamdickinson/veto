import { gql } from 'apollo-server'
import { v1 as uuid } from 'uuid'

import { Entity } from '../types/entity'
import { ImageUrlLookup } from '../types/image'
import { Option } from '../types/option'
import { POLL_URL } from '../config'
import { Poll, PollType, StoredPoll } from '../types/poll'
import { StoredVote } from '../types/vote'
import { User } from '../types/user'
import { download } from '../helpers/download'
import { getMovieImage } from '../helpers/movieImage'

const poll: Entity = {
  typeDefs: gql`
    enum PollType {
      INSTANT_RUNOFF
      APPROVAL
    }

    type Option {
      id: ID!
      name: String!
      imageUrl: String
    }

    type Link {
      url: String!
      user: User!
    }

    interface Poll {
      id: ID!
      name: String!
      options: [Option!]!
      links: [Link!]!
      type: PollType
    }

    type ApprovalPoll implements Poll {
      id: ID!
      name: String!
      options: [Option!]!
      links: [Link!]!
      votes: [ApprovalVote!]
      type: PollType
    }

    type InstantRunoffPoll implements Poll {
      id: ID!
      name: String!
      options: [Option!]!
      links: [Link!]!
      votes: [InstantRunoffVote!]
      type: PollType
    }

    extend type Query {
      poll(id: ID!): Poll!
      polls: [Poll!]!
    }

    extend type Mutation {
      createPoll(name: String!, options: [String!]!, type: PollType): Poll!
      deletePoll(pollId: ID!): Poll!
      updatePoll(pollId: ID!, name: String, options: [String!]): Poll!
    }
  `,

  resolvers: {
    Mutation: {
      createPoll(_, params: { name: string; options: string[]; type?: PollType }, { store }) {
        params.type = params.type ?? PollType.INSTANT_RUNOFF

        const options = params.options.map((name) => ({ id: uuid(), name }))
        const poll: StoredPoll = { id: uuid(), name: params.name, options, type: params.type }

        const polls: StoredPoll[] = store.get('polls') || []
        polls.push(poll)
        store.set('polls', polls)

        return poll
      },

      deletePoll(_, params: { pollId: string }, { isAdmin, store }) {
        if (!isAdmin) return

        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === params.pollId)
        store.set(
          'polls',
          polls.filter(({ id }) => id !== params.pollId)
        )

        const votes: StoredVote[] = store.get('votes') || []
        store.set(
          'votes',
          votes.filter(({ pollId }) => pollId !== params.pollId)
        )

        return poll
      },

      updatePoll(_, params: { name: string; options: string[]; pollId: string }, { store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === params.pollId)
        if (!poll) return

        if (params.name) poll.name = params.name
        if (params.options) {
          poll.options = params.options.map((name) => ({ id: uuid(), name: name }))
        }

        store.set('polls', polls)
        return poll
      },
    },

    Option: {
      imageUrl: async (option: Option, _: any, {store}) => {
        const keyMovieName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        // Look up movie image locally
        const imageKey = keyMovieName(option.name)
        const imagePathNames: ImageUrlLookup = store.get('imagePathNames') || {}
        let imagePathName = imagePathNames[imageKey]
        if (imagePathName !== undefined) return imagePathName

        // Find movie poster
        const sourceImageUrl = await getMovieImage(option.name)
        if (!sourceImageUrl) return null

        // Download poster
        const extension = sourceImageUrl.split('.').pop()
        const imageFilePath = `./data/images/${imageKey}.${extension}`

        try {
          await download(sourceImageUrl, imageFilePath)
          imagePathName = `/images/${imageKey}.${extension}`
        } catch(error) {
          console.error(error)
          imagePathName = null
        }

        // Update in cache and return
        imagePathNames[imageKey] = imagePathName
        store.set('imagePathNames', imagePathNames)
        return imagePathName
      },
    },

    Poll: {
      __resolveType: (poll: Poll) =>
        poll.type === PollType.APPROVAL ? 'ApprovalPoll' : 'InstantRunoffPoll',
    },
    ApprovalPoll: {
      links(poll, _, { isAdmin, store }) {
        if (!isAdmin) return

        const users: User[] = store.get('users') || []
        return users.map((user) => {
          const encodedKey = Buffer.from(`${user.id}:${poll.id}`, 'utf8').toString('base64')
          return { url: `${POLL_URL}poll/#${encodedKey}`, user }
        })
      },
    },

    Query: {
      poll(_, params: { id: string }, { store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        return polls.find(({ id }) => id === params.id)
      },

      polls(_, __, { store }) {
        return store.get('polls')?.reverse() || []
      },
    },
  },
}

export default poll
