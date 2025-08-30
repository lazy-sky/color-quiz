import { useState, useEffect, useCallback } from 'react'
import { usePrevious } from 'react-use'
import { motion } from 'framer-motion'

import { useScore, useStage, useTimer } from '@/hooks'

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

const initialDifficulty = 26

const ColorBoard = () => {
  const [colors, setColors] = useState<ColorProps[]>([])
  const { remainTime, resetTimer, minusTime } = useTimer()
  const { updateScore } = useScore()
  const { stage, clearStage } = useStage()
  const prevStage = usePrevious(stage)

  const handleClickWrong = useCallback(() => {
    minusTime()
  }, [minusTime])

  const handleClickAnswer = useCallback(() => {
    clearStage()
  }, [clearStage])

  const getRandomColor = () => {
    return {
      red: Math.floor(Math.random() * 257),
      green: Math.floor(Math.random() * 257),
      blue: Math.floor(Math.random() * 257),
    }
  }

  const makeColorCell = (rgb: RGBProps, onClick: () => void) => ({
    id: Math.random(),
    rgb,
    onClick,
  })

  const makeColorBoard = useCallback(() => {
    const { red, green, blue } = getRandomColor()

    const baseColorCells = new Array(
      (Math.round((stage + 0.5) / 2) + 1) ** 2 - 1
    )
      .fill(1)
      .map((_) => makeColorCell({ red, green, blue }, handleClickWrong))

    const answerColorCell = makeColorCell(
      {
        red: red - initialDifficulty + Math.min(initialDifficulty - 1, stage),
        green: green - initialDifficulty + Math.min(initialDifficulty - 1, stage),
        blue: blue - initialDifficulty + Math.min(initialDifficulty - 1, stage),
      },
      handleClickAnswer
    )
    baseColorCells.push(answerColorCell)
    setColors(baseColorCells.sort(() => Math.random() - 0.5))
  }, [handleClickAnswer, handleClickWrong, stage])

  useEffect(() => {
    if (stage === prevStage) return
    makeColorBoard()
    updateScore(stage, remainTime)
    resetTimer()
  }, [makeColorBoard, prevStage, remainTime, resetTimer, stage, updateScore])

  const gridCols = Math.round((stage + 0.5) / 2) + 1

  return (
      <div className="flex justify-center items-center flex-1">
          <ul
        className="grid gap-3 w-[min(90vw,min(600px,60vh))] aspect-square"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
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
