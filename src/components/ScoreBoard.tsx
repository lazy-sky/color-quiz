import { useState, useEffect } from 'react';
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

const Information = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 0 auto;
  gap: 12px;
  margin-bottom: 12px;

  #stage, #score, #time {
    font-size: 12px;
    span {
      font-size: 24px;
    }
  }
`;

function ScoreBoard({ 
  stage,
  setStage,
  score, 
  remainingTime, 
  setRemainingTime,
  setScore
}: ScoreBoardProps ) {
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    // TODO: 타이머 멈추도록, 임시로 남은 시간 무한대로 설정
    if (!isRunning) return;
  }, [isRunning]);

  useInterval(() => {
    if (isRunning) {
      setRemainingTime(count => count - 1);
    }

    if (remainingTime <= 0) {
      MySwal.fire({
        title: <p>GAME OVER!</p>,
        html: `
          <div>${stage}단계</div>
          <div>${score}점</div>
        `,
        confirmButtonText: '재도전!',
      })
      .then(() => {
        setStage(1);
        setRemainingTime(15);
        setScore(0);
        setIsRunning(true);
      });
      setRemainingTime(Infinity);
      setIsRunning(false);
    }
  });

  return (
    <>
      <Information>
        <div>
          <div id='stage'>
            <span>{stage}</span>단계
          </div>
          <div id='time'>
            <span>{remainingTime}</span>초
          </div>
        </div>
        <div id='score'>
          <span>{score}</span>점
        </div>
      </Information>
    </>
  );
};

export default ScoreBoard;
