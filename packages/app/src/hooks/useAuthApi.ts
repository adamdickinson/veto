import { ReplaySubject, merge } from 'rxjs'
import { filter, map, tap, switchMap } from 'rxjs/operators'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AuthApi } from '../types/auth'
import { User } from '../types/user'
import { getTokenData, isTokenData, storedTokenData$ } from '../helpers/auth'
import useAuthorizeQuery from '../hooks/useAuthorizeQuery'

export default (): AuthApi => {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string | null>()

  const code$ = useMemo(() => new ReplaySubject<string>(1), [])
  const runAuthorizeQuery = useAuthorizeQuery()

  const newToken$ = useMemo(
    () =>
      code$.pipe(
        switchMap(runAuthorizeQuery),
        map((response) => response.data.authorize)
      ),
    [code$, runAuthorizeQuery]
  )

  const newTokenData$ = useMemo(() => newToken$.pipe(map(getTokenData), filter(isTokenData)), [
    newToken$,
  ])

  useEffect(() => {
    const subscription = merge(storedTokenData$, newTokenData$).subscribe({
      next: (tokenData) => {
        if (tokenData) {
          const { token, user } = tokenData
          localStorage.setItem('token', token)
          setUser(user)
          setToken(token)
        } else {
          setToken(null)
          setUser(undefined)
        }
      },
    })

    return () => subscription.unsubscribe()
  }, [newTokenData$])

  const authorize = useCallback(
    (code: string) => {
      code$.next(code)
    },
    [code$]
  )

  const getCode = useCallback(() => {
    if (!process.env.DISCORD_REDIRECT_URI) throw new Error('Missing config "DISCORD_REDIRECT_URI"')
    window.location.href =
      `${process.env.DISCORD_API_URL}/oauth2/authorize?` +
      `client_id=${process.env.DISCORD_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=identify`
  }, [])

  return {
    authorize,
    getCode,
    user,
    token,
  }
}
