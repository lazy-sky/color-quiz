import { useState, useEffect, useCallback, memo } from 'react'
import styled from 'styled-components'

import { useScore, useStage, useTimer } from 'hooks'

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

const Grid = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 4px;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`

const CellButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: inherit;
`
const initialDifficulty = 26

const ColorBoard = () => {
  const { remainTime, resetTimer, minusTime } = useTimer()
  const [colors, setColors] = useState<ColorProps[]>([])
  const { updateScore } = useScore()
  const { stage, clearStage } = useStage()

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

  const makeColorCell = (id: number, rgb: RGBProps, onClick: () => void) => ({
    id,
    rgb,
    onClick,
  })

  const makeColorBoard = useCallback(() => {
    const { red, green, blue } = getRandomColor()

    const baseColorCells = new Array(
      (Math.round((stage + 0.5) / 2) + 1) ** 2 - 1
    )
      .fill(1)
      .map((_) =>
        makeColorCell(Math.random(), { red, green, blue }, handleClickWrong)
      )

    const answerColorCell = makeColorCell(
      Math.random(),
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
    makeColorBoard()
    if (stage === 1) return

    updateScore(stage, remainTime)
    resetTimer()
    // TODO: 의존성에 remainTime을 추가하면 매초마다 새로운 컬러보드가 렌더링되는 문제가 발생한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeColorBoard, resetTimer, stage, updateScore])

  return (
    <Grid
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
          <CellButton type='button' aria-label='color' onClick={onClick} />
        </li>
      ))}
    </Grid>
  )
}

export default memo(ColorBoard)
