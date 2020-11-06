import { gql } from 'apollo-server'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import queryString from 'query-string'

import {
  DISCORD_API_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
} from '../config'
import { Entity } from '../types/entity'

const auth: Entity = {
  typeDefs: gql`
    extend type Query {
      authorize(code: String!): String
    }
  `,

  resolvers: {
    Query: {
      async authorize(_, params: { code: string }) {
        if (!DISCORD_REDIRECT_URI) throw new Error('Config missing')

        const exchangeUrl = `${DISCORD_API_URL}/oauth2/token`
        const data = {
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: DISCORD_REDIRECT_URI,
          scope: 'identify',
        }

        const token = await fetch(exchangeUrl, {
          body: queryString.stringify(data),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then((response) => response.json())

        const meUrl = `${DISCORD_API_URL}/users/@me`
        const user = await fetch(meUrl, {
          headers: { Authorization: `${token.token_type} ${token.access_token}` },
        }).then((response) => response.json())

        return jwt.sign({ user, token }, 'baahu')
      },
    },
  },
}

export default auth
