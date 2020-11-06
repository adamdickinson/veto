import React, { useMemo } from 'react'
import styled from 'styled-components'

interface Props {
  imageUrl?: string
}

const Cover: React.FC<Props> = ({ imageUrl }) => {
  const opacity = useMemo(() => (Math.random() * 0.5 + 0.2).toFixed(2), [])
  if (!imageUrl) return <Wrap style={{ opacity }}></Wrap>
  return (
    <Wrap className="with-image" style={{ backgroundImage: imageUrl && `url(${imageUrl})` }}></Wrap>
  )
}

export default Cover

const Wrap = styled.div`
  background: rgb(184, 172, 188) 50% 50% no-repeat;
  background-size: cover;
  position: relative;

  &.with-image:before {
    background: rgb(184, 172, 188);
    position: absolute;
    content: '';
    opacity: 0.9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
