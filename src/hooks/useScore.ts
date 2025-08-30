import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { scoreState } from '@/store/atom'

const useScore = () => {
  const [score, setScore] = useRecoilState(scoreState)

  const updateScore = useCallback(
    (stage: number, time: number) => {
      setScore((prev: number) => prev + (stage - 1) ** 3 * time)
    },
    [setScore]
  )

  const resetScore = useCallback(() => {
    setScore(0)
  }, [setScore])

  return { score, updateScore, resetScore }
}

export default useScore
