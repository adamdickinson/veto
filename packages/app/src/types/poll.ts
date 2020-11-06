import { Option } from './option'

export enum PollType {
  INSTANT_RUNOFF = 'INSTANT_RUNOFF',
  APPROVAL = 'APPROVAL',
}

export interface Poll {
  id: string
  name: string
  options: Option[]
  type: PollType
}
