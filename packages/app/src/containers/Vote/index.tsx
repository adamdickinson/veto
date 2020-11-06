import {
  FiSend as SendIcon,
  FiMoreHorizontal as SendingIcon,
  FiMoreHorizontal as LoadingIcon,
} from 'react-icons/fi'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { Option } from '@adamdickinson/veto-api'

import Approval, { OptionResponse } from '../../components/Approval'
import Page from '../../components/Page'

type Responses = Record<string, OptionResponse>

const GET_POLL_OPTIONS = gql`
  query($pollId: ID!) {
    poll(id: $pollId) {
      options {
        id
        name
      }
    }
  }
`

const VOTE_APPROVALS = gql`
  mutation($pollId: ID!, $approvals: [ID!]!, $disapprovals: [ID!]!) {
    voteApprovals(pollId: $pollId, approvals: $approvals, disapprovals: $disapprovals) {
      createdAt
    }
  }
`

interface GetPollOptionsData {
  poll: {
    options: Option[]
  }
}

interface VoteApprovalsVariables {
  pollId: string
  approvals: string[]
  disapprovals: string[]
}

export default ({ pollId }: { pollId?: string }) => {
  const history = useHistory()
  const [responses, setResponses] = useState<Responses>({})
  const { data, loading: loadingPoll } = useQuery<GetPollOptionsData>(GET_POLL_OPTIONS, {
    variables: { pollId },
  })
  const options = data?.poll?.options ?? []
  const nextOption = options.find(({ id }) => !responses[id])

  const [sendVote, { loading: sendingVote, data: voteData }] = useMutation<
    any,
    VoteApprovalsVariables
  >(VOTE_APPROVALS)

  const voteSent = Boolean(voteData?.voteApprovals.createdAt)

  const onResponse = useCallback(
    (option: Option, response: OptionResponse) => {
      const newResponses: Responses = { ...responses, [option.id]: response }
      setResponses(newResponses)
    },
    [responses, setResponses]
  )

  const onSubmit = useCallback(() => {
    if (pollId) {
      const approvals = Object.keys(responses).filter(
        (optionId) => responses[optionId] === 'approve'
      )
      const disapprovals = Object.keys(responses).filter(
        (optionId) => responses[optionId] === 'disapprove'
      )
      sendVote({ variables: { pollId, approvals, disapprovals } })
    }
  }, [pollId, responses])

  const beforeOptions = options.filter(({ id }) => id !== nextOption?.id && Boolean(responses[id]))
  const afterOptions = options.filter(({ id }) => id !== nextOption?.id && !Boolean(responses[id]))

  useEffect(() => {
    if (voteSent) {
      history.push('/result/' + pollId)
    }
  }, [voteSent])

  if (loadingPoll) {
    return (
      <Wrap>
        <BaseStyle />
        <LoadingIcon />
      </Wrap>
    )
  }

  if (!data?.poll?.options) {
    return (
      <Wrap>
        <BaseStyle />
        Poll not found
      </Wrap>
    )
  }

  return (
    <Page>
      <Wrap>
        <BaseStyle />
        <Section>
          {beforeOptions.map((option) => (
            <Approval
              key={option.id}
              option={option}
              onChange={onResponse}
              value={responses[option.id]}
            />
          ))}
        </Section>
        <Section>
          {nextOption && Boolean(nextOption) && (
            <Approval
              active={true}
              option={nextOption}
              onChange={onResponse}
              value={responses[nextOption.id]}
            />
          )}
        </Section>
        <Section>
          {afterOptions.map((option) => (
            <Approval
              key={option.id}
              option={option}
              onChange={onResponse}
              value={responses[option.id]}
            />
          ))}
          {!voteSent && !nextOption && !sendingVote && (
            <SendButton onClick={onSubmit}>
              <SendIcon />
            </SendButton>
          )}
          {!voteSent && !nextOption && sendingVote && (
            <SendButton>
              <SendingIcon />
            </SendButton>
          )}
        </Section>
      </Wrap>
    </Page>
  )
}

const SendButton = styled.button`
  background: green;
  color: white;
  border: 0 none;
  border-radius: 2.5rem;
  font-size: 2rem;
  padding: 1.5rem;
  height: 5rem;
  width: 5rem;
`

const Section = styled.div`
  align-content: center;
  align-items: center;
  display: flex;
  flex: 1 1 0;
  justify-content: center;
  flex-wrap: wrap;
`

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
`

const BaseStyle = createGlobalStyle`
  html, body, #root {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
`
