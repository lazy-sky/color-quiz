import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { hintUsedState } from '@/store/atom'

const useHint = () => {
  const [hintUsed, setHintUsed] = useRecoilState(hintUsedState)
  const MAX_HINTS = 3

  const activateHint = useCallback(() => {
    setHintUsed((prev) => Math.min(prev + 1, MAX_HINTS))
  }, [setHintUsed])

  const resetHint = useCallback(() => {
    setHintUsed(0)
  }, [setHintUsed])

  const canUseHint = hintUsed < MAX_HINTS

  return { hintUsed, canUseHint, activateHint, resetHint, maxHints: MAX_HINTS }
}

export default useHint

