import { MemoryRouter as Router } from 'react-router-dom'
import React from 'react'

import { MockAuthService } from '../services/auth'
import BaseStyle from '../styles/Base'

const Decorator: React.FC = ({ children }) => (
    <MockAuthService loggedIn={true}>
      <BaseStyle />
      <Router>{children}</Router>
    </MockAuthService>
)

export default Decorator
