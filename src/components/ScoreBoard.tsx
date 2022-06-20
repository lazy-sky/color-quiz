import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import styled from 'styled-components'

import { dbService } from '../myFirebase'
import { useScore, useStage, useTimer } from 'hooks'

interface ScoreBoardProps {
  isRunning: boolean
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
}

const MySwal = withReactContent(Swal)

const Information = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 0 auto;
  gap: 12px;
  margin-bottom: 12px;

  #stage,
  #score,
  #time {
    font-size: 12px;
    span {
      font-size: 20px;
    }
  }
`

const ScoreBoard = ({ isRunning, setIsRunning }: ScoreBoardProps) => {
  const navigate = useNavigate()
  const { stage, resetStage } = useStage()
  const { remainTime, startTimer, stopTimer, resetTimer } = useTimer()
  const { score, resetScore } = useScore()

  const onSubmit = useCallback(
    async (nickname: string) => {
      const today = new Date()
      await addDoc(collection(dbService, 'scores'), {
        createdAt: today.toLocaleDateString(),
        stage,
        score,
        nickname,
      })
    },
    [score, stage]
  )

  useEffect(() => {
    if (remainTime === 0) {
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
          <input
            type="text" id="nickname" class="swal2-input" placeholder="익명의 참가자"
            style="width: 90%; margin: 16px 0 0;"
          />
        `,
        confirmButtonText: '재도전!',
        showDenyButton: true,
        denyButtonText: '랭킹 확인!',
        denyButtonColor: '#8a5acc',
      }).then((result) => {
        if (result.isDenied) {
          const nickname =
            (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement)
              .value || '익명의 참가자'
          onSubmit(nickname)
          navigate('/rank')
          return
        }
        resetStage()
        resetTimer()
        resetScore()
        setIsRunning(true)
        const nickname =
          (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement)
            .value || '익명의 참가자'
        onSubmit(nickname)
      })
      setIsRunning(false)
    }
    startTimer()
    return () => stopTimer()
  }, [
    navigate,
    onSubmit,
    remainTime,
    resetScore,
    resetStage,
    resetTimer,
    score,
    setIsRunning,
    stage,
    startTimer,
    stopTimer,
  ])

  return (
    <Information>
      <div>
        <div id='stage'>
          <span>{stage}</span>단계
        </div>
        <div id='time'>
          {isRunning ? (
            <>
              <span>{remainTime}</span>초
            </>
          ) : (
            <span>시간 초과!</span>
          )}
        </div>
      </div>
      <div id='score'>
        <span>{score}</span>점
      </div>
    </Information>
  )
}

export default ScoreBoard
