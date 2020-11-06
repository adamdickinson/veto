import {
  FiThumbsUp as ApproveIcon,
  FiThumbsDown as DisapproveIcon,
  FiMinus as NoOpinionIcon,
} from 'react-icons/fi'
import React, { useCallback } from 'react'
import classnames from 'classnames'
import styled from 'styled-components'

import { Option } from '@adamdickinson/veto-api'

export type OptionResponse = 'approve' | 'no-opinion' | 'disapprove'

interface Props {
  active?: boolean
  option: Option
  onChange(option: Option, response: OptionResponse): void
  value?: OptionResponse
}

const Approval: React.FC<Props> = ({ active, option, onChange, value }) => {
  const onChoose = useCallback((response: OptionResponse) => () => onChange(option, response), [
    option,
    onChange,
  ])
  return (
    <Wrap className={classnames({ active })}>
      {active && (
        <h1>
          <small>Ya wanna watch</small> {option.name}?
        </h1>
      )}
      {!active && <p>{option.name}</p>}
      <Choices>
        <Choice
          className={classnames({ active: value === 'disapprove' })}
          color="red"
          onClick={onChoose('disapprove')}
        >
          <DisapproveIcon />
        </Choice>

        <Choice
          className={classnames({ active: value === 'no-opinion' })}
          color="orange"
          onClick={onChoose('no-opinion')}
        >
          <NoOpinionIcon />
        </Choice>

        <Choice
          className={classnames({ active: value === 'approve' })}
          color="green"
          onClick={onChoose('approve')}
        >
          <ApproveIcon />
        </Choice>
      </Choices>
    </Wrap>
  )
}

export default Approval

const Choice = styled.button<{ color?: string }>`
  --active-color: ${(props) => props.color};
  --button-width: var(--button-size, 3em);
  background: none;
  border-radius: calc(var(--button-width) / 2);
  border: 0 none;
  color: #ccc;
  cursor: pointer;
  font: inherit;
  font-size: 1em;
  height: var(--button-width);
  margin: 0 0 0 0.5em;
  padding: calc(var(--button-width) * 0.3);
  transform: scale(1);
  transition-duration: 75ms;
  transition-property: background-color, color, transform;
  transition-timing-function: ease;
  width: var(--button-width);

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  &:hover {
    color: var(--active-color);
    transform: scale(1.2);
  }

  &.active {
    background: var(--active-color);
    color: white;
    transform: scale(1);
  }
`

const Choices = styled.div``

const Wrap = styled.div`
  align-items: center;
  background: #fff;
  border-radius: 5em;
  display: flex;
  justify-content: center;
  margin: 0.5em 1em;
  font-size: 1.5rem;
  padding: 0.25em 0.25em 0.25em 1.5em;
  opacity: 0.4;
  transition: 75ms opacity;
  text-align: center;

  &:hover {
    opacity: 1;
  }

  &.active {
    flex-direction: column;
    font-size: 2rem;
    background: none;
    opacity: 1;

    p {
      font-size: 1.5em;
      margin: 0 0 0.5em;
    }
  }

  p {
    margin: 0 1rem 0 0;
    text-align: center;

    small {
      font-size: 0.6em;
      display: block;
      margin: 0 0 0.5em;
    }
  }
`
