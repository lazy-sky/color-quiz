import { dbService } from '../myFirebase';
import { collection, getDocs } from 'firebase/firestore';

import { useEffect, useState } from 'react';

import styled from 'styled-components';

interface RankProps {
  id: string;
  createdAt: string;
  stage: number;
  score: number;
  nickname: string;
} 

const Ranking = styled.ul`
  position: relative;
  list-style: none;
  margin: 12px 0;
  padding: 0;
  border: 2px solid #FDF7FF;

  li {
    display: grid;
    grid-template-columns: 3fr 1fr 3fr 3fr;
    margin: 8px 0;
    padding: 4px;
    border-bottom: 1px solid #FDF7FF;
    text-align: center;
  }

  li:first-child {
    font-size: larger;
    background: grey;
    position: sticky;
    top: 0;
    left: 0;
    margin: 0;
  }
`

function RankingPage() {
  const [ranks, setRanks] = useState<RankProps[]>([]);

  const getRanks = async () => {
    const querySnapshot = await getDocs(collection(dbService, "scores"));

    querySnapshot.forEach(document => {
      const rankObject = {
        ...document.data(),
        id: document.id,
      } as RankProps;
      setRanks(prev => [...prev, rankObject]);
    });
  };

  useEffect(() => {
    getRanks();
  }, []);

  return (
    <>
      <h1 style={{
        textAlign: 'center',
        margin: 0
      }}>
        Ranking
      </h1>
      <Ranking>
        <li>
          <div>닉네임</div>
          <div>단계</div>
          <div>점수</div>
          <div>등록일</div>
        </li>
        {ranks.map((rank) => (
          <li key={rank.id}>
            <div>{rank.nickname}</div>
            <div>{rank.stage}</div>
            <div>{rank.score}</div>
            <div>{rank.createdAt}</div>
          </li>
        ))}
      </Ranking>
    </>
  )
}

export default RankingPage;