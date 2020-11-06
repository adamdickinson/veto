import { createService, extendService } from '@adamdickinson/react-service'

import { AuthApi } from '../types/auth'
import useAuthApi from '../hooks/useAuthApi'
import useMockAuthApi, { Props as MockAuthServiceProps } from '../hooks/useMockAuthApi'

const [AuthService, useAuth, authContext] = createService(useAuthApi)

const MockAuthService = extendService<AuthApi, MockAuthServiceProps>(authContext, useMockAuthApi)

export { AuthService, MockAuthService, useAuth }
