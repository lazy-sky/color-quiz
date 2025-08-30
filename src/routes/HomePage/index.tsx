import ScoreBoard from './ScoreBoard'
import ColorBoard from './ColorBoard'

const HomePage = () => {
  return (
      <div className="flex-1 flex flex-col gap-8 justify-center">
          <ScoreBoard />
          <ColorBoard />
      </div>
  )
}

export default HomePage
