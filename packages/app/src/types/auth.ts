import { User } from './user'

export interface AuthApi {
  getCode: () => void
  authorize: (code: string) => void
  token?: string | null
  user?: User
}
