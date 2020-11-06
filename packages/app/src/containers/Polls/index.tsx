import { NavLink, useHistory } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

import { useAuth } from '../../services/auth'
import Cover from '../../components/Cover'
import Page from '../../components/Page'
import buttonStyle from '../../styles/button'
import usePollsQuery from '../../hooks/usePollsQuery'

const range = (count: number) => Object.keys(Array(count).fill(undefined))

export default () => {
  const { user } = useAuth()
  const { data, loading } = usePollsQuery()
  const history = useHistory()
  if (!user) return null

  const activePoll = data?.polls[0]
  const otherPolls = data?.polls.slice(1)

  return (
    <Page>
      <Wrap>
        <h1>
          {user.username}, <small>it&apos;s time to put that opinion to good use</small>
        </h1>
        {Boolean(loading || activePoll) && (
          <ActivePoll>
            <Covers>
              {!activePoll && range(8).map((index) => <Cover key={index} />)}
              {activePoll &&
                activePoll.options.map(({ imageUrl }, index) => (
                  <Cover
                    key={index}
                    imageUrl={imageUrl && `${process.env.IMAGE_API_URL}${imageUrl}`}
                  />
                ))}
            </Covers>

            <PollInfo>
              <h2>
                {Boolean(activePoll) && activePoll?.name}
                {!Boolean(activePoll) && (
                  <>
                    <SkeletonText />
                    <SkeletonText />
                  </>
                )}
              </h2>
              <p>
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
              </p>
              <p>
                <SkeletonText />
              </p>
              <div>
                {!!activePoll && (
                  <NavLink className="button" to={`/poll/${activePoll.id}`}>
                    Vote
                  </NavLink>
                )}
                {!Boolean(activePoll) && <SkeletonButton />}
              </div>
            </PollInfo>
          </ActivePoll>
        )}
        <Polls>
          <h2>Past Polls</h2>
          {otherPolls?.map((otherPoll, index) => (
            <Poll key={index} onClick={() => history.push(`/poll/${otherPoll.id}`)}>
              <PollInfo>
                <h3>{otherPoll.name}</h3>
                <p>(No description)</p>
              </PollInfo>
              <Covers>
                {otherPoll.options.map(({ imageUrl }, index) => (
                  <Cover
                    key={index}
                    imageUrl={imageUrl && `${process.env.IMAGE_API_URL}${imageUrl}`}
                  />
                ))}
              </Covers>
            </Poll>
          ))}
          {!otherPolls &&
            range(8).map((index) => (
              <Poll className="placeholder" key={index}>
                <PollInfo>
                  <h3>
                    <SkeletonText />
                  </h3>
                  <p>
                    <SkeletonText />
                  </p>
                </PollInfo>
                <Covers>
                  {range(8).map((index) => (
                    <Cover key={index} />
                  ))}
                </Covers>
              </Poll>
            ))}
        </Polls>
      </Wrap>
    </Page>
  )
}

const Covers = styled.div`
  flex: 1 1 0;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`

const PollInfo = styled.div`
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  justify-content: center;
  padding-bottom: 7rem;
  padding: 3rem;
  position: relative;
  text-align: center;
`

const SkeletonButton = styled.span`
  ${buttonStyle}
  background: var(--background);
  width: 50%;
`

const SkeletonText = styled.span`
  height: 0.5em;
  display: inline-block;
  margin: 0;
  border-radius: 0.25em;
  background: var(--background);
  width: 80%;

  :last-child {
    width: 60%;
  }
`

const ActivePoll = styled.div`
  display: flex;
  width: 100%;
  height: 30rem;
  animation: pulse;
  background: rgba(184, 172, 188, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(74, 49, 81, 0.03), 0 3px 6px rgba(74, 49, 81, 0.05);

  ${Covers} {
    grid-template-rows: 1fr 1fr;

    > *:nth-child(odd):last-child {
      grid-row: span 2;
    }
  }

  ${PollInfo} {
    width: 24rem;

    :before {
      background: #fff;
      content: '';
      position: absolute;
      top: -50%;
      height: 200%;
      width: 16rem;
      border-radius: 100%;
      left: -1.5rem;
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
    }
  }
`

const Poll = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  height: 6rem;
  width: 60rem;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: opacity 300ms ease-out;

  :not(.placeholder) {
    cursor: pointer;
  }

  h3,
  p {
    margin: 0.25em;
  }

  h3 ${SkeletonText} {
    width: 90%;
  }

  ${PollInfo} {
    width: 16rem;
  }

  & + & {
    margin-top: 2rem;
  }
`

const Polls = styled.div`
  margin-top: 6rem;
  text-align: center;

  :hover > ${Poll} {
    opacity: 0.4;

    :not(.placeholder):hover {
      opacity: 1;
    }
  }
`

const Wrap = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  margin: 0 auto;
  max-width: 80rem;
  padding: 10rem 2rem;
  text-align: center;
`
