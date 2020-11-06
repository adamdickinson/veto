import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import jwt from 'jsonwebtoken'

import path from 'path'

import { SPECIAL_USER_NAME } from './config'
import { resolvers, typeDefs } from './entities'
import createStore from './stores/fileStore'

const store = createStore()
store.get('users')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    const token = req.headers.authorization || ''
    const code = token.substr('Bearer '.length)
    let user

    if (code === SPECIAL_USER_NAME) {
      user = { id: SPECIAL_USER_NAME }
    } else if(code) {
      user = jwt.verify(code, 'baahu')
    }

    return {
      isAdmin: code === SPECIAL_USER_NAME,
      store,
      user,
    }
  },
})

const app = express()
app.use('/images', express.static(path.join(__dirname, '../data/images')))

server.applyMiddleware({ app })

app.listen({ url: '0.0.0.0', port: 4000 }, () =>
  console.log(`:: Server ready at http://0.0.0.0:4000`)
)
