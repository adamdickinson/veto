import { gql, useQuery } from '@apollo/client'
import Chart from 'react-google-charts'
import React, { useMemo } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { ApprovalResult } from '@adamdickinson/veto-api'

const GET_RESULT = gql`
  query($pollId: ID!) {
    result(pollId: $pollId) {
      ... on ApprovalResult {
        scores {
          score
          option {
            name
          }
        }
      }
      winners {
        id
        name
      }
    }
  }
`

interface GetResultData {
  result: ApprovalResult
}

const BAR_COLORS = [
  '#d43d51',
  '#dd6355',
  '#e38460',
  '#e7a273',
  '#ebbe8e',
  '#f1d8ae',
  '#faf1d2',
  '#dddeb8',
  '#becca1',
  '#9cbb8d',
  '#77aa7e',
  '#4d9873',
  '#00876c',
]

export default ({ pollId }: { pollId?: string }) => {
  const { data } = useQuery<GetResultData>(GET_RESULT, {
    variables: { pollId },
    pollInterval: 10000,
    fetchPolicy: 'no-cache'
  })

  const maxScore = useMemo(
    () => data?.result.scores.reduce((max, { score }) => Math.max(max, score), 0) ?? 0,
    [data?.result.scores]
  )

  const minScore = useMemo(
    () => data?.result.scores.reduce((min, { score }) => Math.min(min, score), 0) ?? 0,
    [data?.result.scores]
  )

  const chartData = useMemo(() => {
    if (!data?.result.scores) return undefined

    const getColor = (score: number) => {
      const level = Math.max(0, (score + maxScore) / (maxScore * 2)) * (BAR_COLORS.length - 1)
      return BAR_COLORS[level]
    }

    const scores = [...data.result.scores]
    scores.sort((a, b) => b.score - a.score)

    return [
      ['Movie', 'Score', { role: 'style' }],
      ...scores.map(({ option, score }) => [option.name, score, getColor(score)]),
    ]
  }, [data?.result.scores])

  return (
    <Wrap>
      <BaseStyle />
      <Chart
        width="100%"
        height="100%"
        chartType="BarChart"
        data={chartData}
        options={{
          animation: {
            duration: 1000,
            easing: 'out',
            startup: true,
          },
          hAxis: {
            format: '0',
            viewWindow: { min: minScore, max: maxScore },
          },
          bar: {
            groupWidth: 20,
          },
          fontSize: 12,
          legend: { position: 'none' },
          interactive: false,
        }}
      />
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  position: absolute;
  top: 2rem;
  right: 2rem;
  left: 2rem;
  bottom: 2rem;
`

const BaseStyle = createGlobalStyle`
  html, body, #root {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
`
