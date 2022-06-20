import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { stageState } from 'store/atom'

const useStage = () => {
  const [stage, setStage] = useRecoilState(stageState)

  const clearStage = useCallback(() => {
    setStage((prevStage) => prevStage + 1)
  }, [setStage])

  const resetStage = useCallback(() => {
    setStage(1)
  }, [setStage])

  return { stage, clearStage, resetStage }
}

export default useStage
