import { Link } from './link'
import { Option } from './option'

export enum PollType {
  INSTANT_RUNOFF = 'INSTANT_RUNOFF',
  APPROVAL = 'APPROVAL',
}

interface StoredBasePoll {
  id: string
  name: string
  options: Option[]
}

export interface StoredApprovalPoll extends StoredBasePoll {
  type: PollType.APPROVAL
}

export interface StoredInstantRunoffPoll extends StoredBasePoll {
  type?: PollType.INSTANT_RUNOFF
}

export type StoredPoll = StoredApprovalPoll | StoredInstantRunoffPoll

interface BasePoll extends StoredBasePoll {
  links?: Link[]
}

export interface ApprovalPoll extends BasePoll {
  type: PollType.APPROVAL
}

export interface InstantRunoffPoll extends BasePoll {
  type: PollType.INSTANT_RUNOFF
}

export type Poll = ApprovalPoll | InstantRunoffPoll
