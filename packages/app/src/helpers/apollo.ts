import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const createClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_API_URL,
  })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return token
      ? {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        }
      : { headers }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
}
