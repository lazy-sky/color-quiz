import { memo } from 'react'
import AnimatedNumber from 'react-animated-numbers'

const Score = ({ score }: { score: number }) => {
  return (
    <AnimatedNumber
      animateToNumber={score}
      includeComma
      fontStyle={{ fontSize: 28 }}
    />
  )
}

export default memo(Score)
