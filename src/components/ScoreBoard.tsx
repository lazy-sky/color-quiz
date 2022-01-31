import { useInterval } from '../hooks/score';

import styled from 'styled-components';

interface ScoreBoardProps {
  stage: number;
  score: number;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
}
const StartButton = styled.button`
  display: block;
  margin: 0 auto 12px;
`;

const Information = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
`;

function ScoreBoard({ stage, score, remainingTime, setRemainingTime }: ScoreBoardProps ) {
  useInterval(() => {
    setRemainingTime(count => count - 1);

    if (remainingTime <= 0) {
      alert('Game Over!')
      setRemainingTime(16);
    }
  });

  const handleClickStart = () => {
    setRemainingTime(15);
  }

  return (
    <>
      <StartButton onClick={handleClickStart}>
        Start!
      </StartButton>
      <Information>
          <div>스테이지: {stage}</div>
          <div>남은 시간: {remainingTime}</div>
          <div>점수: {score}</div>
      </Information>
    </>
  );
};

export default ScoreBoard;
