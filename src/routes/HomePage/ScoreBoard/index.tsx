import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { dbService } from '../../../myFirebase'
import { useScore, useStage, useTimer } from 'hooks'

import styles from './scoreBoard.module.scss'

const MySwal = withReactContent(Swal)

const ScoreBoard = () => {
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

        const nickname =
          (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement)
            .value || '익명의 참가자'
        onSubmit(nickname)
      })
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
    stage,
    startTimer,
    stopTimer,
  ])

  return (
    <div className={styles.scoreBoard}>
      <div>
        <div id='stage'>
          <span>{stage}</span>단계
        </div>
        <div id='time'>
          {remainTime > 0 ? (
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
    </div>
  )
}

export default ScoreBoard
