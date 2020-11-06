import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import decodeJwt from 'jwt-decode'

import { User } from '../types/user'

interface TokenData {
  token: string
  user: User
}

export const isTokenData = (tokenData: TokenData | null): tokenData is TokenData =>
  Boolean(tokenData)

export const getStoredToken = () => localStorage.getItem('token')

export const getTokenData = (token: string | null): TokenData | null => {
  if (!token) return null

  const data: any = decodeJwt(token)
  const rawUser = data?.user

  const id = rawUser?.id
  const username = rawUser?.username
  const avatar = rawUser?.avatar

  if (typeof id === 'string' && typeof username === 'string' && typeof avatar === 'string') {
    const user: User = {
      id,
      username,
      avatar,
    }

    return { user, token }
  }

  return null
}

export const storedToken$ = new Observable<string | null>((observer) => {
  const token = getStoredToken()
  observer.next(token)
  observer.complete()
})

export const storedTokenData$ = storedToken$.pipe(map(getTokenData))
