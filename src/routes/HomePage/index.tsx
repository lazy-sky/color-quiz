import ScoreBoard from './ScoreBoard'
import ColorBoard from './ColorBoard'

const HomePage = () => {
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
      <ScoreBoard />
      <ColorBoard />
    </div>
  )
}

export default HomePage
