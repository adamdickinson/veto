import { gql, useQuery, FetchPolicy } from '@apollo/client'

import { Poll } from '../types/poll'

const COSMOS_QUERY_OPTIONS: { fetchPolicy: FetchPolicy } | {} = process.env.RUNNING_COSMOS
  ? { fetchPolicy: 'no-cache' }
  : {}

export interface PollsQueryData {
  polls: Poll[]
}

export const PollsQuery = gql`
  query {
    polls {
      id
      name
      options {
        id
        name
        imageUrl
      }
      type
    }
  }
`

export default () =>
  useQuery<PollsQueryData, {}>(PollsQuery, {
    ...COSMOS_QUERY_OPTIONS,
  })
