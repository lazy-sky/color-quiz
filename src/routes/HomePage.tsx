import { useState } from 'react'

import ScoreBoard from '../components/ScoreBoard'
import ColorBoard from '../components/ColorBoard'

const HomePage = () => {
  const [isRunning, setIsRunning] = useState(true)

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          margin: 0,
        }}
      >
        Color Quiz
      </h1>
      <ScoreBoard isRunning={isRunning} setIsRunning={setIsRunning} />
      <ColorBoard />
    </div>
  )
}

export default HomePage
