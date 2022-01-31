import { useState } from 'react';

import ScoreBoard from './components/ScoreBoard';
import ColorBoard from './components/ColorBoard';

function App() {
  const [stage, setStage] = useState(1);
  const [remainingTime, setRemainingTime] = useState(15);
  const [score, setScore] = useState(0);

  return (
    <>
      <h1>Color Quiz</h1>
      <ScoreBoard 
        stage={stage} 
        score={score}
      />
      <ColorBoard 
        stage={stage} 
        setStage={setStage}
        remainingTime={remainingTime}
        setRemainingTime={setRemainingTime}
      /> 
    </>
  );
}

export default App;
