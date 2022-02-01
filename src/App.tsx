import { useState } from 'react';

import ScoreBoard from './components/ScoreBoard';
import ColorBoard from './components/ColorBoard';

function App() {
  const [stage, setStage] = useState(1);
  const [remainingTime, setRemainingTime] = useState(0);
  const [score, setScore] = useState(0);

  return (
    <>
      <h1 style={{
        textAlign: 'center'
      }}>
        Color Quiz
      </h1>
      <ScoreBoard 
        stage={stage}
        setStage={setStage} 
        score={score}
        setScore={setScore}
        remainingTime={remainingTime}
        setRemainingTime={setRemainingTime}
      />
      <ColorBoard 
        stage={stage} 
        setStage={setStage}
        remainingTime={remainingTime}
        setRemainingTime={setRemainingTime}
        score={score}
        setScore={setScore}
      /> 
    </>
  );
}

export default App;
