import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  query,
  collection,
  getDocs,
  orderBy,
  where,
  limit,
} from 'firebase/firestore'
import PageHeader from 'components/PageHeader'

import { dbService } from 'myFirebase'

interface RankProps {
  id: string
  createdAt: string
  stage: number
  score: number
  nickname: string
}

const Ranking = styled.ul`
  position: relative;
  list-style: none;
  margin: 12px 0;
  padding: 0;
  border: 2px solid #fdf7ff;

  li {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 2fr 2fr;
    margin: 8px 0;
    padding: 4px;
    border-bottom: 1px solid #fdf7ff;
    text-align: center;
  }

  li:first-child {
    font-weight: bold;
    background: grey;
    position: sticky;
    top: 0;
    left: 0;
    margin: 0;
  }
`

const RankingPage = () => {
  const [ranks, setRanks] = useState<RankProps[]>([])

  const getRanks = async () => {
    // TODO: 나중에 무한 스크롤 랭킹보드로
    const topRanks = query(
      collection(dbService, 'scores'),
      where('score', '>', 0),
      orderBy('score', 'desc'),
      limit(100)
    )
    const documentSnapshots = await getDocs(topRanks)

    documentSnapshots.forEach((document) => {
      const rankObject = {
        ...document.data(),
        id: document.id,
      } as RankProps
      setRanks((prev) => [...prev, rankObject])
    })
  }

  useEffect(() => {
    getRanks()
  }, [])

  return (
    <>
      <PageHeader title='Top 100' />
      <Ranking>
        <li>
          <div>순위</div>
          <div>닉네임</div>
          <div>단계</div>
          <div>점수</div>
          <div>등록일</div>
        </li>
        {ranks.map((rank, i) => (
          <li key={rank.id}>
            <div>{i + 1}</div>
            <div>{rank.nickname}</div>
            <div>{rank.stage}</div>
            <div>{rank.score.toLocaleString()}</div>
            <div>{rank.createdAt}</div>
          </li>
        ))}
      </Ranking>
    </>
  )
}

export default RankingPage
