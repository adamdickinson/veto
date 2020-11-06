import { AnimatePresence } from 'framer-motion'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import { AuthService } from './services/auth'
import { createClient } from './helpers/apollo'
import App from './containers/App'
import BaseStyle from './styles/Base'

ReactDOM.render(
  <ApolloProvider client={createClient()}>
    <AuthService>
      <BaseStyle />
      <Router>
        <AnimatePresence>
          <App />
        </AnimatePresence>
      </Router>
    </AuthService>
  </ApolloProvider>,
  document.getElementById('root')
)
