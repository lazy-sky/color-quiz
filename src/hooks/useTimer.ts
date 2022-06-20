import { useCallback, useRef } from 'react'
import { useRecoilState } from 'recoil'

import { remainTimeState } from 'store/atom'

const useTimer = () => {
  const [remainTime, setRemainTime] = useRecoilState(remainTimeState)
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current !== null) return

    intervalRef.current = setInterval(() => {
      setRemainTime((prev) => prev - 1)
    }, 1000)
  }, [setRemainTime])

  const stopTimer = useCallback(() => {
    if (intervalRef.current === null) return

    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const resetTimer = useCallback(() => {
    setRemainTime((_) => 15)
  }, [setRemainTime])

  const minusTime = useCallback(() => {
    setRemainTime((prev) => Math.max(prev - 3, 0))
  }, [setRemainTime])

  return { remainTime, startTimer, stopTimer, resetTimer, minusTime }
}

export default useTimer
