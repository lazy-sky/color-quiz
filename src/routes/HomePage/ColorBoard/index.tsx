import { useState, useEffect, useCallback } from 'react'
import { usePrevious } from 'react-use'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'

import { useScore, useStage, useTimer, useHint } from '@/hooks'
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
  const { hintUsed, canUseHint, activateHint, resetHint, maxHints } = useHint()
  const prevStage = usePrevious(stage)
  const gameMode = useRecoilValue(gameModeState)

  const handleClickWrong = useCallback(() => {
    minusTime()
  }, [minusTime])

  const handleClickAnswer = useCallback(() => {
    clearStage()
    // 힌트는 게임 전체에서 유지되므로 스테이지 클리어 시 리셋하지 않음
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

  const handleUseHint = useCallback(() => {
    if (!canUseHint) return
    
    // 정답 셀 찾기
    const answerIndex = colors.findIndex(
      (color) => color.onClick === handleClickAnswer
    )
    
    if (answerIndex === -1) return
    
    // 현재 그리드 크기 계산
    const gridColumns = Math.ceil(Math.sqrt(colors.length))
    const gridRows = Math.ceil(colors.length / gridColumns)
    
    // 정답 셀의 행과 열 위치 계산
    const answerRow = Math.floor(answerIndex / gridColumns)
    const answerCol = answerIndex % gridColumns
    
    // 정답 셀의 행과 열을 제외한 나머지 행/열 인덱스 찾기
    const rowsToRemove = []
    const colsToRemove = []
    
    for (let row = 0; row < gridRows; row++) {
      if (row !== answerRow) {
        rowsToRemove.push(row)
      }
    }
    
    for (let col = 0; col < gridColumns; col++) {
      if (col !== answerCol) {
        colsToRemove.push(col)
      }
    }
    
    // 제거할 행과 열을 하나씩 선택 (랜덤하게)
    if (rowsToRemove.length > 0 && colsToRemove.length > 0) {
      const rowToRemove = rowsToRemove[Math.floor(Math.random() * rowsToRemove.length)]
      const colToRemove = colsToRemove[Math.floor(Math.random() * colsToRemove.length)]
      
      // 제거할 셀들의 인덱스 계산
      const indicesToRemove = new Set<number>()
      
      // 선택된 행의 모든 셀 제거
      for (let col = 0; col < gridColumns; col++) {
        const index = rowToRemove * gridColumns + col
        if (index < colors.length) {
          indicesToRemove.add(index)
        }
      }
      
      // 선택된 열의 모든 셀 제거
      for (let row = 0; row < gridRows; row++) {
        const index = row * gridColumns + colToRemove
        if (index < colors.length) {
          indicesToRemove.add(index)
        }
      }
      
      // 정답 셀은 제거하지 않음
      indicesToRemove.delete(answerIndex)
      
      // 남은 색상들만 필터링
      const newColors = colors.filter((_, index) => !indicesToRemove.has(index))
      
      if (newColors.length > 0) {
        setColors(newColors)
        
        // 힌트 사용 표시 및 시간 페널티
        activateHint()
        minusTime()
      }
    }
  }, [colors, hintUsed, handleClickAnswer, activateHint, minusTime])

  useEffect(() => {
    if (stage === prevStage) return
    makeColorBoard()
    updateScore(stage, remainTime)
    resetTimer()
    // 힌트는 게임 전체에서 유지되므로 스테이지 변경 시 리셋하지 않음
  }, [makeColorBoard, prevStage, remainTime, resetTimer, stage, updateScore])

  // 그리드 크기 계산: 색상 개수에 맞춰 정사각형 그리드 유지
  const gridSize = Math.ceil(Math.sqrt(colors.length))
  const gridColumns = gridSize > 0 ? gridSize : Math.round((stage + 0.5) / 2) + 1

  return (
      <div className="flex flex-col justify-center items-center flex-1 gap-4">
          <ul
        className="grid gap-3 w-[min(90vw,min(600px,60vh))] aspect-square"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
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
          <button
        type="button"
        onClick={handleUseHint}
        disabled={!canUseHint || colors.length <= 2}
        className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none shadow-lg overflow-hidden group"
      >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">💡</span>
              <span>Hint! ({hintUsed}/{maxHints})</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
      </div>
  )
}

export default ColorBoard
