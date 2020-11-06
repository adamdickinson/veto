import merge from 'lodash/merge'

import auth from './auth'
import poll from './poll'
import result from './result'
import user from './user'
import vote from './vote'

const base = {
  typeDefs: `
    type Query {
      test: Boolean!
    }

    type Mutation {
      test: Boolean!
    }
  `,
  resolvers: {
    Query: { test: () => true },
    Mutation: { test: () => true },
  },
}

const entities = [base, auth, poll, result, user, vote]

export const typeDefs = merge(entities.map(({ typeDefs }) => typeDefs))
export const resolvers = merge(entities.map(({ resolvers }) => resolvers))
