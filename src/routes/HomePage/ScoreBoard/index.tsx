import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrevious, useUnmount } from 'react-use'
import { motion } from 'framer-motion'

import { supabase } from '@/lib/supabase'
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
      try {
        const { error } = await supabase.from('scores').insert({
          created_at: new Date().toISOString(),
          nickname,
          stage,
          score,
        })

        if (error) {
          throw error
        }
      } catch (error) {
        console.error('Error submitting score:', error)
      }
    },
    [score, stage]
  )

  const resetGame = useCallback(() => {
    resetStage()
    resetTimer()
    resetScore()
    startTimer()
  }, [resetScore, resetStage, resetTimer, startTimer])

  const handleRetry = async () => {
    try {
      await submitScore(nickname)
      setIsGameOver(false)
      setTimeout(() => {
        resetGame()
      }, 100)
    } catch (error) {
      console.error('Error submitting score:', error)
    }
  }

  const handleRanking = async () => {
    try {
      await submitScore(nickname)
      setIsGameOver(false)
      navigate('/rank')
    } catch (error) {
      console.error('Error submitting score:', error)
    }
  }

  useEffect(() => {
    if (remainTime === 0 && previousTime !== 0) {
      stopTimer()
      setIsGameOver(true)
    }
  }, [remainTime, previousTime, stopTimer])

  useEffect(() => {
    if (!isGameOver) {
      startTimer()
    }
    return () => stopTimer()
  }, [isGameOver, startTimer, stopTimer])

  useUnmount(() => {
    resetStage()
    resetScore()
    stopTimer()
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
                <span className="text-3xl font-medium text-destructive dark:text-red-600">
                    시간 초과!
                </span>
            )}
                  </motion.div>
              </div>
          </div>

          <Dialog open={isGameOver} onOpenChange={() => {}}>
              <DialogContent className="sm:max-w-md" hideClose>
                  <DialogHeader>
                      <DialogTitle className="text-2xl text-center">GAME OVER!</DialogTitle>
                      <DialogDescription className="text-center">
                          <div className="flex justify-center gap-8 mt-4 mb-6">
                              <div className="text-lg">
                                  <span className="font-medium text-primary dark:text-blue-400">{stage}</span>{' '}
                                  단계
                              </div>
                              <div className="text-lg">
                                  <span className="font-medium text-primary dark:text-blue-400">
                                      {score.toLocaleString()}
                                  </span>{' '}
                                  점
                              </div>
                          </div>
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <p className="text-center text-gray-600 dark:text-gray-400">
                          닉네임을 입력 후 버튼을 눌러주세요!
                      </p>
                      <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800"
              placeholder="익명의 참가자"
            />
                  </div>
                  <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
                      <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-8 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-800"
            >
                          재도전!
                      </button>
                      <button
              onClick={handleRanking}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-900 hover:bg-gray-200/90 h-10 px-8 py-2 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/90 dark:focus-visible:ring-gray-800"
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
