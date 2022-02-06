import { dbService } from '../myFirebase';
import { collection, getDocs } from 'firebase/firestore';

import { useEffect, useState } from 'react';

interface RankProps {
  id: string;
  createdAt: string;
  score: number;
  nickname: string;
} 

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
      <ul>
        {ranks.map((rank) => (
          <li key={rank.id}>
            <div>{rank.score}</div>
            <div>{rank.nickname}</div>
            <div>{rank.createdAt}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default RankingPage;