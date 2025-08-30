import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from '@/components/Layout'
import HomePage from './HomePage'
import RankingPage from './RankingPage'

const App = () => {
  return (
      <Router>
          <Layout>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rank" element={<RankingPage />} />
              </Routes>
          </Layout>
      </Router>
  )
}

export default App
