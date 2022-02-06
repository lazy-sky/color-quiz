import { useState } from 'react';

import ScoreBoard from '../components/ScoreBoard';
import ColorBoard from '../components/ColorBoard';

function HomePage() {
  // TODO: 고민 거리, 이 상태들을 객체로 묶어서 관리하는 게 좋을까? 아니면 분리해둘까?
  const [stage, setStage] = useState(1);
  const [remainingTime, setRemainingTime] = useState(15);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  return (
    <div style={{
      height: '100vh',
    }}>
      <h1 style={{
        textAlign: 'center',
        margin: 0
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
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />
      <ColorBoard 
        stage={stage} 
        setStage={setStage}
        remainingTime={remainingTime}
        setRemainingTime={setRemainingTime}
        setScore={setScore}
      /> 
    </div>
  );
}

export default HomePage;