import store from 'store'

import { InstantRunoffPoll } from '../types/poll'
import { StoredVote } from '../types/vote'

type StoreJsApi = typeof store

export const getInstantRunoffResult = (poll: InstantRunoffPoll, store: StoreJsApi) => {
  const options = poll.options

  const votes: StoredVote[] = store.get('votes') || []
  const relevantVotes = votes.filter(({ pollId }) => pollId === params.pollId)

  const tally = {}
  const votePrefereces = votes.map(({ preferences }) => [...preferences])

  const losers = []
  options.forEach(({ id }) => {
    tally[id] = 0
  })

  const votesCast = votePreferences.length
  const votesRequired = votesCast / 2
  const newResult = {
    pollId: params.pollId,
    rounds: [],
    winners: [],
  }

  while (true) {
    // Reset tally
    Object.keys(tally).forEach((id) => {
      tally[id] = 0
    })

    const round = {
      pollId: params.pollId,
      voteIds: [],
      minVotes: 0,
      votesRequired,
      loserIds: [...losers],
    }

    newResult.rounds.push(round)

    votePreferences.forEach((preferences) => {
      if (preferences.length) {
        const nextPreference = preferences.find(({ id }) => !losers.includes(id))
        round.voteIds.push(nextPreference.id)
        tally[nextPreference.id]++
      }
    })

    const activeOptions = Object.keys(tally).filter((id) => !losers.includes(id))
    const minVotes = Object.values(tally).reduce((min, count) => Math.min(min, count), Infinity)
    round.minVotes = minVotes

    losers.push(...Object.keys(tally).filter((id) => tally[id] === minVotes))
    losers.forEach((id) => {
      delete tally[id]
    })

    for (const id of Object.keys(tally)) {
      if (tally[id] > votesRequired) {
        newResult.winners = [options.find((option) => option.id === id)]
        return { value: newResult }
      }
    }

    if (!Object.keys(tally).filter((id) => Boolean(tally[id])).length) {
      newResult.winners = activeOptions.map((id) => options.find((option) => option.id === id))
      return { value: newResult }
    }
  }
}
