import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Navigation from './Navigation';
import HomePage from '../routes/HomePage';
import RankingPage from '../routes/RankingPage';

const AppRouter = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rank" element={<RankingPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
