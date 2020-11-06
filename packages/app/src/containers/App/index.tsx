import { Redirect, Route, Switch } from 'react-router-dom'
import React from 'react'

import { useAuth } from '../../services/auth'
import Auth from '../Auth'
import LogIn from '../LogIn'
import Polls from '../Polls'
import Result from '../Result'
import Vote from '../Vote'

export default () => {
  const { token } = useAuth()
  if (token === undefined) return null

  const loggedIn = Boolean(token)
  if (loggedIn)
    return (
      <Switch>
        <Route path="/polls" component={Polls} />
        <Route path="/poll/:pollId" render={({ match }) => <Vote pollId={match.params.pollId} />} />
        <Route
          path="/result/:pollId"
          render={({ match }) => <Result pollId={match.params.pollId} />}
        />
        <Redirect to="/polls" />
      </Switch>
    )

  return (
    <Switch>
      <Route
        path="/auth"
        render={({ location }) => {
          const queryParams = new URLSearchParams(location.search)
          return <Auth code={queryParams.get('code')} />
        }}
      />
      <Route path="/login" component={LogIn} />
      <Redirect to="/login" />
    </Switch>
  )
}
