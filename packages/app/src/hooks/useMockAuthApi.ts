import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthApi } from '../types/auth'
import { User } from '../types/user'

const MOCK_AUTH_CODE = 'mock-code'
const MOCK_AUTH_TOKEN = 'mock-token'

const MOCK_USER: User = {
  id: 'user-1',
  avatar: 'sample.png',
  username: 'mockuser',
}

export interface Props {
  loggedIn?: boolean
  mockAuthCode?: string
  mockAuthToken?: string
  mockUser?: User
}

export default ({ loggedIn, mockAuthCode, mockAuthToken, mockUser }: Props): AuthApi => {
  loggedIn ??= true
  mockAuthCode ??= MOCK_AUTH_CODE
  mockAuthToken ??= MOCK_AUTH_TOKEN
  mockUser ??= MOCK_USER

  const history = useHistory()
  const [user, setUser] = useState<User | undefined>()
  const [token, setToken] = useState<string | null>()

  useEffect(() => {
    if (loggedIn && mockUser && mockAuthToken) {
      setUser(mockUser)
      setToken(mockAuthToken)
    }
  }, [])

  const authorize = useCallback(
    (code: string) => {
      if (mockAuthToken && code === mockAuthCode) {
        setToken(mockAuthToken)
        setUser(mockUser)
      } else {
        setToken(null)
        setUser(undefined)
      }
    },
    [mockAuthCode, mockAuthToken, mockUser]
  )

  const getCode = useCallback(() => history.push(`/auth?code=${mockAuthCode}`), [history])

  return {
    authorize,
    getCode,
    user,
    token,
  }
}
