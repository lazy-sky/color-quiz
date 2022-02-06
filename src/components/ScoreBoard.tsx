import { dbService } from '../myFirebase';
import { addDoc, collection } from "firebase/firestore";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  isRunning: boolean;
  setIsRunning: (isRunning: boolean | ((isRunning: boolean) => boolean)) => void;
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
  setScore,
  isRunning,
  setIsRunning
}: ScoreBoardProps ) {
  const navigate = useNavigate();
  const onSubmit = async (nickname: string) => {
    try {
      const today = new Date();
      await addDoc(collection(dbService, "scores"), {
        createdAt: today.toLocaleDateString(),
        stage,
        score,
        nickname,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isRunning) return;
  }, [isRunning]);

  useInterval(() => {
    if (isRunning) {
      setRemainingTime(count => count - 1);
    }

    if (remainingTime === 0) {
      MySwal.fire({
        title: <p>GAME OVER!</p>,
        html: `
          <style>
            #alert-info {
              display: flex;
              justify-content: center;
              gap: 16px;
              margin-bottom: 12px;
            }
          </style>
          <div id="alert-info">
            <div>${stage}단계</div>
            <div>${score}점</div>
          </div>
          <div>닉네임을 입력 후 버튼을 눌러주세요!</div>
          <input type="text" id="nickname" class="swal2-input" placeholder="익명의 참가자">
        `,
        confirmButtonText: '재도전!',
        showDenyButton: true,
        denyButtonText: '랭킹 확인!',
        denyButtonColor: '#8a5acc',
      })
      .then((result) => {
        if (result.isDenied) {
          const nickname = (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement).value 
          || '익명의 참가자';
          onSubmit(nickname);
          navigate('/rank');
          return;
        }
        setStage(1);
        setRemainingTime(15);
        setScore(0);
        setIsRunning(true);
        const nickname = (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement).value 
        || '익명의 참가자';
        onSubmit(nickname);
      });
      setIsRunning(false);
    }
  });

  return (
    <Information>
      <div>
        <div id='stage'>
          <span>{stage}</span>단계
        </div>
        <div id='time'>
          {isRunning 
          ? (<>
              <span>{remainingTime}</span>초
            </>) 
          : (<>
              <span>시간 초과!</span>
            </>)}
        </div>
      </div>
      <div id='score'>
        <span>{score}</span>점
      </div>
    </Information>
  );
};

export default ScoreBoard;
