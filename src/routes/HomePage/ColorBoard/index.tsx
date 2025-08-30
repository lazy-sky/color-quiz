import { useState, useEffect, useCallback } from 'react'
import { usePrevious } from 'react-use'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'

import { useScore, useStage, useTimer } from '@/hooks'
import { gameModeState } from '@/store/atom'

interface RGBProps {
  red: number
  green: number
  blue: number
}

interface ColorProps {
  id: number
  onClick: () => void
  rgb: RGBProps
}

const ColorBoard = () => {
  const [colors, setColors] = useState<ColorProps[]>([])
  const { remainTime, resetTimer, minusTime } = useTimer()
  const { updateScore } = useScore()
  const { stage, clearStage } = useStage()
  const prevStage = usePrevious(stage)
  const gameMode = useRecoilValue(gameModeState)

  const handleClickWrong = useCallback(() => {
    minusTime()
  }, [minusTime])

  const handleClickAnswer = useCallback(() => {
    clearStage()
  }, [clearStage])

  // 스테이지에 따른 난이도 계산
  const calculateDifficulty = (stage: number) => {
    // 스테이지가 올라갈수록 색상 차이가 줄어듦 (더 어려워짐)
    const baseDifficulty = 50 // 초기 색상 차이
    const minDifficulty = 5   // 최소 색상 차이
    const difficultyDecrease = 2 // 스테이지당 감소량

    return Math.max(
      minDifficulty,
      baseDifficulty - (stage - 1) * difficultyDecrease
    )
  }

  const getRandomColor = () => {
    // 기본 색상 범위를 중간 값으로 제한하여 밝기 조절의 여유를 확보
    return {
      red: Math.floor(Math.random() * 156) + 50, // 50~205 범위
      green: Math.floor(Math.random() * 156) + 50,
      blue: Math.floor(Math.random() * 156) + 50,
    }
  }

  const makeColorCell = (rgb: RGBProps, onClick: () => void) => ({
    id: Math.random(),
    rgb,
    onClick,
  })

  const adjustColor = (value: number, difficulty: number, isLighter: boolean): number => {
    // 모드에 따라 색상 차이를 더 크게 만듦
    const adjustment = isLighter ? difficulty : -difficulty
    return Math.max(0, Math.min(255, value + adjustment))
  }

  const makeColorBoard = useCallback(() => {
    const baseColor = getRandomColor()
    const difficulty = calculateDifficulty(stage)
    
    // 게임 모드에 따라 밝기 방향 결정
    const isLighter = gameMode === 'random' 
      ? Math.random() < 0.5 
      : gameMode === 'light'

    const baseColorCells = new Array(
      (Math.round((stage + 0.5) / 2) + 1) ** 2 - 1
    )
      .fill(1)
      .map((_) => makeColorCell(baseColor, handleClickWrong))

    // 정답 칸의 색상 생성
    const answerColor = {
      red: adjustColor(baseColor.red, difficulty, isLighter),
      green: adjustColor(baseColor.green, difficulty, isLighter),
      blue: adjustColor(baseColor.blue, difficulty, isLighter),
    }

    const answerColorCell = makeColorCell(answerColor, handleClickAnswer)
    baseColorCells.push(answerColorCell)
    setColors(baseColorCells.sort(() => Math.random() - 0.5))
  }, [handleClickAnswer, handleClickWrong, stage, gameMode])

  useEffect(() => {
    if (stage === prevStage) return
    makeColorBoard()
    updateScore(stage, remainTime)
    resetTimer()
  }, [makeColorBoard, prevStage, remainTime, resetTimer, stage, updateScore])

  return (
      <div className="flex justify-center items-center flex-1">
          <ul
        className="grid gap-3 w-[min(90vw,min(600px,60vh))] aspect-square"
        style={{
          gridTemplateColumns: `repeat(${Math.round((stage + 0.5) / 2) + 1}, 1fr)`,
        }}
      >
              {colors.map(({ id, onClick, rgb }) => (
                  <motion.li
            key={id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})`,
            }}
            className="relative rounded-lg shadow-lg overflow-hidden"
          >
                      <button
              type="button"
              aria-label="color"
              onClick={onClick}
              className="absolute inset-0 w-full h-full transition-transform hover:scale-95 active:scale-90 focus:outline-none"
            />
                  </motion.li>
        ))}
          </ul>
      </div>
  )
}

export default ColorBoard
