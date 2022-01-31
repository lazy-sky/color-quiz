import { useInterval } from '../hooks/score';

interface ScoreBoardProps {
  stage: number;
  score: number;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
}
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
