import { useCallback, useRef } from 'react'
import { useRecoilState } from 'recoil'

import { remainTimeState } from '@/store/atom'

const useTimer = () => {
  const [remainTime, setRemainTime] = useRecoilState(remainTimeState)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setRemainTime((prev: number) => prev - 1)
    }, 1000)
  }, [setRemainTime])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetTimer = useCallback(() => {
    setRemainTime((_: number) => 15)
  }, [setRemainTime])

  const minusTime = useCallback(() => {
    setRemainTime((prev: number) => Math.max(prev - 3, 0))
  }, [setRemainTime])

  return { remainTime, startTimer, stopTimer, resetTimer, minusTime }
}

export default useTimer
