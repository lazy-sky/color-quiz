import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrevious, useUnmount } from 'react-use'
import { addDoc, collection } from 'firebase/firestore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { dbService } from 'myFirebase'
import { useScore, useStage, useTimer } from 'hooks'
import Score from './Score'

import styles from './scoreBoard.module.scss'

const MySwal = withReactContent(Swal)

const ScoreBoard = () => {
  const navigate = useNavigate()
  const { stage, resetStage } = useStage()
  const { remainTime, startTimer, stopTimer, resetTimer } = useTimer()
  const { score, resetScore } = useScore()
  const previousTime = usePrevious(remainTime)

  const submitScore = useCallback(
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

  const resetGame = useCallback(() => {
    resetStage()
    resetTimer()
    resetScore()
  }, [resetScore, resetStage, resetTimer])

  useEffect(() => {
    if (remainTime === 0 && previousTime !== 0) {
      MySwal.fire({
        title: <p>GAME OVER!</p>,
        html: `
          <style>
            .alert-info {
              display: flex;
              justify-content: center;
              gap: 16px;
              margin-bottom: 12px;
            }
          </style>
          <div class="alert-info">
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
      }).then(({ isDismissed, isDenied }) => {
        const nickname =
          (Swal.getPopup()?.querySelector('#nickname') as HTMLInputElement)
            .value || '익명의 참가자'

        // 팝업 바깥 클릭
        if (isDismissed) {
          resetGame()
          return
        }

        submitScore(nickname)
        resetGame()

        // '랭킹 확인' 클릭
        if (isDenied) {
          navigate('/rank')
          return
        }

        // '재도전' 클릭
        submitScore(nickname)
        resetGame()
      })
    }

    startTimer()
    return () => stopTimer()
  }, [
    navigate,
    remainTime,
    previousTime,
    resetGame,
    score,
    stage,
    startTimer,
    stopTimer,
    submitScore,
  ])

  useUnmount(() => {
    resetStage()
    resetScore()
  })

  return (
    <div className={styles.scoreBoard}>
      <div>
        <span>{stage}</span>단계
      </div>
      <div className={styles.score}>
        <Score score={score} />점
      </div>
      <div>
        {remainTime > 0 ? <span>{remainTime}초</span> : <span>시간 초과!</span>}
      </div>
    </div>
  )
}

export default ScoreBoard
