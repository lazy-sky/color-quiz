import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import Navigation from '../components/Navigation'
import HomePage from './HomePage'
import RankingPage from './RankingPage'

import styles from './routes.module.scss'

const App = () => {
  return (
    <div className={styles.app}>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/rank' element={<RankingPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
