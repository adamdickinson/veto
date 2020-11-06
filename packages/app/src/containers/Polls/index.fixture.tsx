import { MockedProvider as MockApolloProvider, MockedResponse } from '@apollo/client/testing'
import React from 'react'

import { Option } from '../../types/option'
import { PollType } from '../../types/poll'
import { PollsQuery, PollsQueryData } from '../../hooks/usePollsQuery'
import Polls from './'

const SAMPLE_OPTIONS: Option[] = [
  {
    id: 'a2f889b0-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'The Matrix',
    imageUrl: '/images/the-matrix.jpg',
  },
  {
    id: 'a2f889b1-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'The Mummy',
    imageUrl: '/images/the-mummy.jpg',
  },
  {
    id: 'a2f889b2-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'Baahubali',
    imageUrl: '/images/baahubali.jpg',
  },
  {
    id: 'a2f889b3-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'Terminator 2',
    imageUrl: '/images/terminator-2.jpg',
  },
  {
    id: 'a2f889b4-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'Extractor',
    imageUrl: '/images/extractor.jpg',
  },
  {
    id: 'a2f889b5-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'Transformers',
    imageUrl: '/images/transformers.jpg',
  },
  {
    id: 'a2f889b6-25a9-11eb-aa7a-ad1dd9b62f07',
    name: 'Star Wars: Rogue One',
    imageUrl: '/images/star-wars-rogue-one.jpg',
  },
]

const POLL_MOCKS: MockedResponse<PollsQueryData>[] = [
  {
    request: {
      query: PollsQuery,
      variables: {},
    },
    result: {
      data: {
        polls: [
          {
            id: 'poll-1',
            name: 'Friday 21 Sep',
            options: SAMPLE_OPTIONS,
            type: PollType.APPROVAL,
          },
          {
            id: 'poll-2',
            name: 'Friday 14 Sep',
            options: SAMPLE_OPTIONS.slice(3, 8),
            type: PollType.APPROVAL,
          },
          {
            id: 'poll-3',
            name: 'Friday 7 Sep',
            options: SAMPLE_OPTIONS.slice(5, 7),
            type: PollType.APPROVAL,
          },
          {
            id: 'poll-4',
            name: 'Friday 31 Aug',
            options: SAMPLE_OPTIONS.slice(1, 9),
            type: PollType.APPROVAL,
          },
          {
            id: 'poll-5',
            name: 'Friday 24 Aug',
            options: SAMPLE_OPTIONS.slice(0, 4),
            type: PollType.APPROVAL,
          },
        ],
      },
    },
  },
]

export default () => {
  return (
    <MockApolloProvider mocks={POLL_MOCKS} addTypename={false}>
      <Polls />
    </MockApolloProvider>
  )
}
