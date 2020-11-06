import { ApprovalPoll, InstantRunoffPoll, Poll } from './poll'
import { Option } from './option'

interface BaseResult {
  poll: Poll
  winners: Option[]
}

export interface ApprovalScore {
  score: number
  option: Option
}

export interface ApprovalResult extends BaseResult {
  poll: ApprovalPoll
  scores: ApprovalScore[]
  winners: Option[]
}

export interface InstantRunoffRound {
  loserIds: string[]
  losers: Option[]
  minVotes: number
  pollId: string
  voteIds: string[]
  votes: Option[]
  votesRequired: number
}

export interface InstantRunoffResult extends BaseResult {
  poll: InstantRunoffPoll
  rounds: InstantRunoffRound[]
  winners: Option[]
}

export type Result = ApprovalResult | InstantRunoffResult
