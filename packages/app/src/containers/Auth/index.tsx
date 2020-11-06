import React, { useEffect } from 'react'

import { useAuth } from '../../services/auth'

interface Props {
  code?: string | null
}

const Auth: React.FC<Props> = ({ code }) => {
  const { authorize } = useAuth()

  useEffect(() => {
    if (code) authorize(code)
  }, [authorize, code])

  return <div>Authorizing...</div>
}

export default Auth
