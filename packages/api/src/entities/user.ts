import { gql } from 'apollo-server'
import { v1 as uuid } from 'uuid'

import { Entity } from '../types/entity'
import { User } from '../types/user'

const user: Entity = {
  typeDefs: gql`
    type User {
      id: ID!
      name: String!
    }

    extend type Query {
      users: [User!]!
    }

    extend type Mutation {
      addUser(name: String!): User!
      deleteUser(id: ID!): User!
    }
  `,

  resolvers: {
    Mutation: {
      addUser(_, { name }, { store }) {
        const users: User[] = store.get('users') || []
        const user = { id: uuid(), name }
        store.set('users', [...users, user])
        return user
      },

      deleteUser(_, params, { isAdmin, store }) {
        if (!isAdmin) return

        const users: User[] = store.get('users') || []
        const user = users.find(({ id }) => id === params.id)
        store.set(
          'users',
          users.filter(({ id }) => id !== params.id)
        )

        return user
      },
    },

    Query: {
      users(_, __, { isAdmin, store }) {
        if (!isAdmin) return []
        return store.get('users') || []
      },
    },
  },
}

export default user
