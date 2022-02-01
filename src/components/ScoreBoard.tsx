import { useInterval } from '../hooks/score';

import styled from 'styled-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ScoreBoardProps {
  stage: number;
  setStage: (stage: number | ((stage: number) => number)) => void;
  score: number;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
  setScore: (score: number | ((score: number) => number)) => void;
}

const MySwal = withReactContent(Swal);

const RestartButton = styled.button`
  display: block;
  margin: 0 auto 12px;
`;

const Information = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
`;

function ScoreBoard({ 
  stage,
  setStage,
  score, 
  remainingTime, 
  setRemainingTime,
  setScore
}: ScoreBoardProps ) {

  useInterval(() => {
    setRemainingTime(count => count - 1);

    if (remainingTime <= 0) {
      MySwal.fire({
        title: <p>GAME OVER!</p>,
        text: `스테이지: ${stage} 점수: ${score}`,
        confirmButtonText: '재도전!',
      })
      .then(() => {
        console.log('go first')
        setStage(1);
        setRemainingTime(15);
        setScore(0);
      });
      setRemainingTime(999);
    }
  });

  const handleClickStart = () => {
    setScore(0);
    setStage(1);
    setRemainingTime(15);
  }

  return (
    <>
      <RestartButton onClick={handleClickStart}>
        다시하기!
      </RestartButton>
      <Information>
          <div>스테이지: {stage}</div>
          <div>남은 시간: {remainingTime}</div>
          <div>점수: {score}</div>
      </Information>
    </>
  );
};

export default ScoreBoard;
