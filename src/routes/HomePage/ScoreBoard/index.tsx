import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrevious, useUnmount } from 'react-use'
import { addDoc, collection } from 'firebase/firestore'
import { motion } from 'framer-motion'

import { dbService } from '@/lib/firebase'
import { useScore, useStage, useTimer } from '@/hooks'
import Score from './Score'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const ScoreBoard = () => {
  const navigate = useNavigate()
  const { stage, resetStage } = useStage()
  const { remainTime, startTimer, stopTimer, resetTimer } = useTimer()
  const { score, resetScore } = useScore()
  const previousTime = usePrevious(remainTime)
  const [isGameOver, setIsGameOver] = useState(false)
  const [nickname, setNickname] = useState('익명의 참가자')

  const submitScore = useCallback(
    async (nickname: string) => {
      const today = new Date()
      await addDoc(collection(dbService, 'scores'), {
        createdAt: today.toLocaleDateString(),
        stage,
        score,
        nickname,
      })
    },
    [score, stage]
  )

  const resetGame = useCallback(() => {
    resetStage()
    resetTimer()
    resetScore()
    setIsGameOver(false)
  }, [resetScore, resetStage, resetTimer])

  const handleRetry = async () => {
    await submitScore(nickname)
    resetGame()
  }

  const handleRanking = async () => {
    await submitScore(nickname)
    resetGame()
    navigate('/rank')
  }

  useEffect(() => {
    if (remainTime === 0 && previousTime !== 0) {
      setIsGameOver(true)
    }

    startTimer()
    return () => stopTimer()
  }, [
    navigate,
    remainTime,
    previousTime,
    resetGame,
    score,
    stage,
    startTimer,
    stopTimer,
    submitScore,
  ])

  useUnmount(() => {
    resetStage()
    resetScore()
  })

  return (
      <>
          <div className="max-w-md mx-auto backdrop-blur-sm mt-6 mb-6">
              <div className="grid gap-6">
                  <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center"
          >
                      <span className="text-2xl mr-2">Stage</span>
                      <span className="text-3xl font-bold">{stage}</span>
                  </motion.div>
                  <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
          >
                      <Score score={score} />
                      <span className="text-2xl ml-2">점</span>
                  </motion.div>
                  <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
                      {remainTime > 0 ? (
                          <span className="text-3xl font-medium">
                              {remainTime}
                              <span className="text-xl ml-1">초</span>
                          </span>
            ) : (
                <span className="text-3xl font-medium text-destructive">
                    시간 초과!
                </span>
            )}
                  </motion.div>
              </div>
          </div>

          <Dialog open={isGameOver} onOpenChange={setIsGameOver}>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle className="text-2xl text-center">GAME OVER!</DialogTitle>
                      <DialogDescription className="text-center">
                          <div className="flex justify-center gap-8 mt-4 mb-6">
                              <div className="text-lg">
                                  <span className="font-medium text-primary">{stage}</span> 단계
                              </div>
                              <div className="text-lg">
                                  <span className="font-medium text-primary">
                                      {score.toLocaleString()}
                                  </span>{' '}
                                  점
                              </div>
                          </div>
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <p className="text-center text-muted-foreground">
                          닉네임을 입력 후 버튼을 눌러주세요!
                      </p>
                      <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="익명의 참가자"
            />
                  </div>
                  <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
                      <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
            >
                          재도전!
                      </button>
                      <button
              onClick={handleRanking}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-8 py-2"
            >
                          랭킹 확인!
                      </button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </>
  )
}

export default ScoreBoard
