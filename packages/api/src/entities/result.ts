import { gql } from 'apollo-server'

import { Entity } from '../types/entity'
import { InstantRunoffRound, Result } from '../types/result'
import { PollType, StoredPoll } from '../types/poll'
import { getApprovalResult } from '../helpers/approval'
import { getInstantRunoffResult } from '../helpers/instantRunoff'

const result: Entity = {
  typeDefs: gql`
    type Round {
      losers: [Option!]!
      minVotes: Int!
      votes: [Option!]!
      votesRequired: Int!
    }

    interface Result {
      poll: Poll!
      winners: [Option!]!
    }

    type ApprovalScore {
      score: Int!
      option: Option!
    }

    type InstantRunoffRound {
      losers: [Option!]!
      minVotes: Int!
      pollId: ID!
      votes: [Option!]!
      votesRequired: Int!
    }

    type ApprovalResult implements Result {
      poll: Poll!
      scores: [ApprovalScore!]!
      winners: [Option!]!
    }

    type InstantRunoffResult implements Result {
      poll: Poll!
      rounds: [InstantRunoffRound!]!
      winners: [Option!]!
    }

    extend type Query {
      result(pollId: ID!): Result!
    }
  `,

  resolvers: {
    Result: {
      __resolveType: (result: Result) =>
        result.poll.type === PollType.APPROVAL ? 'ApprovalResult' : 'InstantRunoffResult',

      poll(result, _, { store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        return polls.find(({ id }) => result.pollId === id)
      },
    },

    Round: {
      losers(round: InstantRunoffRound, _, { store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => round.pollId === id)
        if (!poll) return []

        const options = poll.options
        return options.filter((option) => round.loserIds.includes(option.id))
      },

      votes(round: InstantRunoffRound, _, { store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => round.pollId === id)
        if (!poll) return []

        const options = poll.options
        return round.voteIds.map((id) => options.find((option) => option.id === id))
      },
    },

    Query: {
      result(_, params: { pollId: string }, { isAdmin, store }) {
        const polls: StoredPoll[] = store.get('polls') || []
        const poll = polls.find(({ id }) => params.pollId === id)
        if (!poll) throw new Error('Poll not found')

        if (poll.type === PollType.APPROVAL) return getApprovalResult(poll, store)
        else if (poll.type === PollType.INSTANT_RUNOFF) return getInstantRunoffResult(poll, store)
      },
    },
  },
}

export default result
