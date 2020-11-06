import { gql } from 'apollo-server'

import { Entity } from '../types/entity'
import { Poll, PollType, StoredPoll } from '../types/poll'
import { StoredApprovalVote, StoredInstantRunoffVote, StoredVote } from '../types/vote'
import { User } from '../types/user'
import { areUnorderedListsEqual } from '../helpers/list'

const vote: Entity = {
  typeDefs: gql`
    interface Vote {
      createdAt: String!
      poll: Poll!
      user: User!
    }

    type ApprovalVote implements Vote {
      createdAt: String!
      poll: ApprovalPoll!
      approvals: [Option!]!
      disapprovals: [Option!]!
      user: User!
    }

    type InstantRunoffVote implements Vote {
      createdAt: String!
      poll: InstantRunoffPoll!
      preferences: [Option!]!
      user: User!
    }

    extend type Query {
      votes: [Vote!]!
    }

    extend type Mutation {
      vote(pollId: ID!, preferences: [ID!], approvals: [ID!], disapprovals: [ID!]): Vote!
      voteApprovals(pollId: ID!, approvals: [ID!]!, disapprovals: [ID!]!): ApprovalVote!
      votePreferences(pollId: ID!, preferences: [ID!]!): InstantRunoffVote!
    }
  `,

  resolvers: {
    ApprovalVote: {
      approvals(vote: StoredApprovalVote, _, { store }) {
        const polls: Poll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === vote.pollId)
        if (!poll || poll.type !== PollType.APPROVAL) return

        return vote.approvalIds.map((id) => poll.options.find((option) => option.id === id))
      },
      disapprovals(vote: StoredApprovalVote, _, { store }) {
        const polls: Poll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === vote.pollId)
        if (!poll || poll.type !== PollType.APPROVAL) return

        return vote.disapprovalIds.map((id) => poll.options.find((option) => option.id === id))
      },
    },
    Mutation: {
      voteApprovals(
        _,
        params: { pollId: string; approvals: string[]; disapprovals: string[] },
        { store, user }
      ) {
        const polls: Poll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === params.pollId)
        if (!poll || poll.type !== PollType.APPROVAL) return

        const optionIds = poll.options.map(({ id }) => id)

        const vote: StoredApprovalVote = {
          pollId: params.pollId,
          userId: user.id,

          approvalIds: params.approvals.filter((id) => optionIds.includes(id)),
          disapprovalIds: params.disapprovals.filter((id) => optionIds.includes(id)),
          createdAt: new Date().toISOString(),
        }

        let votes: StoredVote[] = store.get('votes') || []
        votes = votes.filter(
          ({ userId, pollId }) => userId !== vote.userId || pollId !== vote.pollId
        )
        store.set('votes', [...votes, vote])
        return vote
      },

      votePreferences(_, params: { pollId: string; preferences: string[] }, { store, user }) {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === params.pollId)
        if (!poll || (poll.type && poll.type !== PollType.INSTANT_RUNOFF)) return

        const optionIds = poll.options.map(({ id }) => id)
        if (!areUnorderedListsEqual([optionIds, params.preferences]))
          throw new Error('Not all preferences chosen')

        const vote: StoredInstantRunoffVote = {
          pollId: params.pollId,
          userId: user.id,

          preferences: params.preferences.filter((id) => optionIds.includes(id)),
          createdAt: new Date().toISOString(),
        }

        let votes: StoredVote[] = store.get('votes') || []
        votes = votes.filter(
          ({ userId, pollId }) => userId !== vote.userId || pollId !== vote.pollId
        )
        store.set('votes', [...votes, vote])
        return vote
      },
    },

    Vote: {
      __resolveType: (vote: StoredVote) => {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => id === vote.pollId)
        if (!poll) return

        return poll.type === PollType.APPROVAL ? 'ApprovalVote' : 'InstantRunoffVote'
      },
      user(vote, _, { isAdmin, store }) {
        if (!isAdmin) return

        const users: User[] = store.get('users') || []
        return users.find(({ id }) => id === vote.userId)
      },

      poll(vote, _, { isAdmin, store }) {
        if (!isAdmin) return

        const polls: StoredPoll[] = store.get('polls') || []
        return polls.find(({ id }) => id === vote.pollId)
      },
    },

    Query: {
      votes(_, __, { isAdmin, store }) {
        return isAdmin ? store.get('votes') || [] : []
      },
    },
  },
}

export default vote
