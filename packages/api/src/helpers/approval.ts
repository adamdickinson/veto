import store from 'store'

import { ApprovalPoll } from '../types/poll'
import { ApprovalResult, ApprovalScore } from '../types/result'
import { StoredApprovalVote } from '../types/vote'

type StoreJsApi = typeof store

export const getApprovalResult = (poll: ApprovalPoll, store: StoreJsApi): ApprovalResult => {
  let votes: StoredApprovalVote[] = store.get('votes') || []
  votes = votes.filter((vote) => vote.pollId === poll.id)

  const approvalIds = votes.flatMap(({ approvalIds }) => approvalIds)
  const disapprovalIds = votes.flatMap(({ disapprovalIds }) => disapprovalIds)

  const scores: ApprovalScore[] = poll.options.map((option) => ({
    score:
      approvalIds.filter((id) => option.id === id).length -
      disapprovalIds.filter((id) => option.id === id).length,
    option,
  }))

  const maxScore = scores.reduce((max, { score }) => Math.max(max, score), 0)
  const winners = scores.filter(({ score }) => score === maxScore).map(({ option }) => option)

  return {
    poll,
    scores,
    winners,
  }
}
