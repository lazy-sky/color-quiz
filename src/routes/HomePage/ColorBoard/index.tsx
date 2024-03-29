import { useState, useEffect, useCallback } from 'react'
import { usePrevious } from 'react-use'

import { useScore, useStage, useTimer } from 'hooks'

import styles from './colorBoard.module.scss'

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
        green:
          green - initialDifficulty + Math.min(initialDifficulty - 1, stage),
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

  return (
    <ul
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${
          Math.round((stage + 0.5) / 2) + 1
        }, 1fr)`,
      }}
    >
      {colors.map(({ id, onClick, rgb }) => (
        <li
          key={id}
          style={{
            backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})`,
          }}
        >
          <button type='button' aria-label='color' onClick={onClick} />
        </li>
      ))}
    </ul>
  )
}

export default ColorBoard
