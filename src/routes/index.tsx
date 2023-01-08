import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navigation from '../components/Navigation'
import HomePage from './HomePage'
import RankingPage from './RankingPage'

import styles from './routes.module.scss'

const App = () => {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/rank' element={<RankingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
