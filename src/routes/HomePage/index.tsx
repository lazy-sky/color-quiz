import PageHeader from 'components/PageHeader'
import ScoreBoard from './ScoreBoard'
import ColorBoard from './ColorBoard'

const HomePage = () => {
  return (
    <div>
      <PageHeader title='Color Quiz' />
      <ScoreBoard />
      <ColorBoard />
    </div>
  )
}

export default HomePage
