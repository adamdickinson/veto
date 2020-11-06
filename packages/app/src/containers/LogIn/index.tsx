import React from 'react'
import styled from 'styled-components'

import { useAuth } from '../../services/auth'
import Page from '../../components/Page'
import discordLogo from '../../assets/discord.svg'

export default () => {
  const { getCode } = useAuth()
  return (
    <Page>
      <Wrap>
        <Content>
          <h1>Veto</h1>
          <p>When you want a bit more than a standard poll.</p>
          <Button className="discord" onClick={getCode}>
            <span>Log in with</span>
            <img src={discordLogo} />
          </Button>
        </Content>
      </Wrap>
    </Page>
  )
}

const Button = styled.button`
  cursor: pointer;
  overflow: hidden;
  position: relative;

  :hover,
  :focus {
    &:after {
      background: #fff;
      opacity: 0.2;
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }

  &.discord {
    background: var(--discord-blue);
    color: #fff;
    font-size: 2rem;
    height: auto;
    padding: 0.5em 1.5em 0.25em;
    border-radius: 2em;
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      height: 2em;
      width: auto;
    }

    span {
      font-size: 0.5em;
      font-weight: bold;
      opacity: 0.5;
    }
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 3rem;

  h1 {
    margin-bottom: 0;
  }

  p {
    margin: 0.5em 0 2em;
  }
`

const Wrap = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
`
