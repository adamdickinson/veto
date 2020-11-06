import { Option } from './option'
import { Poll } from './poll'
import { User } from './user'

interface StoredBaseVote {
  createdAt: string
  pollId: string
  userId: string
}

export interface StoredApprovalVote extends StoredBaseVote {
  approvalIds: string[]
  disapprovalIds: string[]
}

export interface StoredInstantRunoffVote extends StoredBaseVote {
  preferences: string[]
}

export type StoredVote = StoredApprovalVote | StoredInstantRunoffVote

interface BaseVote extends StoredBaseVote {
  poll: Poll
  user: User
}

export interface ApprovalVote extends BaseVote {
  approvals: Option[]
  disapprovals: Option[]
}

export interface InstantRunoffVote extends BaseVote {
  preferences: Option[]
}

export type Vote = ApprovalVote | InstantRunoffVote
