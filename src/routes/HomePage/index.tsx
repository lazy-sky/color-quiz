import ScoreBoard from './ScoreBoard'
import ColorBoard from './ColorBoard'

const HomePage = () => {
  return (
    <div>
      <h1
        style={{
          textAlign: 'center',
          fontSize: '36px',
          margin: '20px auto',
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
