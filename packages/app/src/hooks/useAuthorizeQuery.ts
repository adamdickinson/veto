import { gql, useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

interface AuthorizeQueryData {
  authorize: string
}

interface AuthorizeQueryVariables {
  code: string
}

export default () => {
  const client = useApolloClient()
  return useCallback(
    (code: string) =>
      client.query<AuthorizeQueryData, AuthorizeQueryVariables>({
        query: gql`query ($code: String!) { authorize(code: $code) }`,
        variables: { code },
      }),
    [client]
  )
}
