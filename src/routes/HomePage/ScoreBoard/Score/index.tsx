import { memo } from 'react'

interface ScoreProps {
  score: number
}

const Score = ({ score }: ScoreProps) => {
  return <span className='text-2xl font-bold'>{score.toLocaleString()}</span>
}

export default memo(Score)
