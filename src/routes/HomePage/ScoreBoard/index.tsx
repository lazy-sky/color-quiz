import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePrevious, useUnmount } from 'react-use'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'

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
  const location = useLocation()
  const { stage, resetStage } = useStage()
  const { remainTime, startTimer, stopTimer, resetTimer } = useTimer()
  const { score, resetScore } = useScore()
  const previousTime = usePrevious(remainTime)
  const [isGameOver, setIsGameOver] = useState(false)
  const [nickname, setNickname] = useState('익명')
  const [rank, setRank] = useState<number | null>(null)
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 라우트 변경 감지 및 상태 초기화
  useEffect(() => {
    setIsGameOver(false)
    setShowConfetti(false)
    startTimer()
  }, [location.pathname, startTimer])

  const calculateRank = useCallback(async () => {
    try {
      // 환경 변수 확인
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        console.warn('Supabase 환경 변수가 설정되지 않아 랭킹을 불러올 수 없습니다.')
        return
      }

      const { count: higherScores, error: higherError } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .gt('score', score)

      if (higherError) throw higherError

      const { count: total, error: totalError } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      if (higherScores !== null && total !== null) {
        const newRank = higherScores + 1
        setRank(newRank)
        setTotalPlayers(total)
        
        // 10등 안에 들었을 때 폭죽 효과 표시
        if (newRank <= 10) {
          setShowConfetti(true)
        }
      }
    } catch (error) {
      console.error('Error calculating rank:', error)
      // 사용자에게 친화적인 에러 메시지 표시는 생략 (게임 플레이 방해 최소화)
    }
  }, [score])

  const submitScore = useCallback(
    async (nickname: string) => {
      // 이미 저장된 경우 중복 저장 방지
      if (isScoreSubmitted) {
        console.warn('점수가 이미 저장되었습니다.')
        return
      }

      // 이미 제출 중인 경우 중복 제출 방지
      if (isSubmitting) {
        console.warn('점수 저장 중입니다.')
        return
      }

      try {
        setIsSubmitting(true)
        
        // 환경 변수 확인
        if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
          console.warn('Supabase 환경 변수가 설정되지 않아 점수를 저장할 수 없습니다.')
          return
        }

        const { error } = await supabase.from('scores').insert({
          created_at: new Date().toISOString(),
          nickname,
          stage,
          score,
        })

        if (error) throw error

        // 저장 성공 시 플래그 설정
        setIsScoreSubmitted(true)
      } catch (error) {
        console.error('Error submitting score:', error)
        // 사용자에게 친화적인 에러 메시지 표시는 생략 (게임 플레이 방해 최소화)
      } finally {
        setIsSubmitting(false)
      }
    },
    [score, stage, isScoreSubmitted, isSubmitting]
  )

  const resetGameState = useCallback(() => {
    setIsGameOver(false)
    setShowConfetti(false)
    setRank(null)
    setTotalPlayers(null)
    setIsScoreSubmitted(false)
    setIsSubmitting(false)
    resetStage()
    resetScore()
    resetTimer()
    startTimer()
  }, [resetStage, resetScore, resetTimer, startTimer])

  // 컴포넌트 마운트/언마운트 시 상태 초기화
  useEffect(() => {
    resetGameState()
    return () => {
      setIsGameOver(false)
      setShowConfetti(false)
      stopTimer()
    }
  }, [resetGameState, stopTimer])

  const handleRetry = async () => {
    try {
      await submitScore(nickname)
      // 저장 완료 여부와 관계없이 게임 상태 리셋 (이미 저장된 경우에도 재도전 가능)
      resetGameState()
    } catch (error) {
      console.error('Error submitting score:', error)
      // 에러가 발생해도 게임 상태는 리셋
      resetGameState()
    }
  }

  const handleRanking = async () => {
    try {
      await submitScore(nickname)
      // 저장 완료 여부와 관계없이 게임 상태 리셋 후 랭킹 페이지로 이동
      resetGameState()
      navigate('/rank')
    } catch (error) {
      console.error('Error submitting score:', error)
      // 에러가 발생해도 랭킹 페이지로 이동
      resetGameState()
      navigate('/rank')
    }
  }

  useEffect(() => {
    if (remainTime === 0 && previousTime !== 0) {
      stopTimer()
      setIsGameOver(true)
      calculateRank()
    }
  }, [remainTime, previousTime, stopTimer, calculateRank])

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
          {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100]">
              <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            recycle={true}
            gravity={0.2}
          />
          </div>
      )}
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
                          <div className="flex flex-col items-center gap-2 mt-4 mb-6">
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
                              {rank !== null && totalPlayers !== null && (
                              <div className="mt-2 text-lg font-medium text-primary dark:text-blue-400">
                                  {rank}위 / {totalPlayers}명
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                      상위 {Math.round((rank / totalPlayers) * 100)}%
                                      {rank <= 10 && (
                                      <div className="mt-1 text-yellow-500 dark:text-yellow-400 font-bold">
                                          🎉 TOP 10 달성! 🎉
                                      </div>
                      )}
                                  </div>
                              </div>
                )}
                          </div>
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <p className="text-center text-gray-600 dark:text-gray-400">
                          {isSubmitting ? '점수를 저장하고 있습니다...' : '닉네임을 입력 후 버튼을 눌러주세요!'}
                      </p>
                      <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={5}
              disabled={isSubmitting || isScoreSubmitted}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800"
              placeholder="닉네임"
            />
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          {nickname.length}/5
                      </div>
                  </div>
                  <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
                      {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2 py-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent dark:border-gray-50 dark:border-t-transparent"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">점수 저장 중...</span>
                          </div>
                      ) : (
                          <>
                              <button
                                  onClick={handleRetry}
                                  disabled={isScoreSubmitted}
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-8 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-800"
                              >
                                  {isScoreSubmitted ? '저장됨' : '재도전!'}
                              </button>
                              <button
                                  onClick={handleRanking}
                                  disabled={isScoreSubmitted}
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-900 hover:bg-gray-200/90 h-10 px-8 py-2 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/90 dark:focus-visible:ring-gray-800"
                              >
                                  {isScoreSubmitted ? '저장됨' : '랭킹 확인!'}
                              </button>
                          </>
                      )}
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </>
  )
}

export default ScoreBoard
