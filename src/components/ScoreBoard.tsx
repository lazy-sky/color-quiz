import { useState } from 'react';
import { useInterval } from '../hooks/score';

function ScoreBoard() {
  const [stage, setStage] = useState(1);
  const [remainingTime, setRemainingTime] = useState(15);
  const [score, setScore] = useState(0);

  useInterval(() => {
    setRemainingTime(count => count - 1);

    if (remainingTime === 0) {
      alert('Game Over!')
      setRemainingTime(16);
    }
  });

  const handleClickStart = () => {
    setRemainingTime(15);
  }

  return (
    <>
      <button onClick={handleClickStart}>Start!</button>
      <div>
        <div>스테이지: {stage}</div>
        <div>남은 시간: {remainingTime}</div>
        <div>점수: {score}</div>
      </div>
    </>
  );
};

export default ScoreBoard;
