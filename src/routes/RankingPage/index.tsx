import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { motion } from 'framer-motion'

import { dbService } from '@/lib/firebase'

interface RankProps {
  id: string
  nickname: string
  stage: number
  score: number
  createdAt: string
}

const RankingPage = () => {
  const [ranks, setRanks] = useState<RankProps[]>([])

  useEffect(() => {
    const getRanks = async () => {
      const q = query(
        collection(dbService, 'scores'),
        orderBy('score', 'desc'),
        limit(10)
      )
      const querySnapshot = await getDocs(q)
      const rankData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RankProps[]
      setRanks(rankData)
    }

    getRanks()
  }, [])

  return (
      <div className="container max-w-2xl mx-auto px-4">
          <div className="mt-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                      <div>순위</div>
                      <div>닉네임</div>
                      <div className="text-center">단계</div>
                      <div className="text-right">점수</div>
                  </div>
                  <div className="divide-y divide-gray-700">
                      {ranks.map((rank, index) => (
                          <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-700/30 transition-colors"
              >
                              <div className="font-medium">
                                  {index + 1}
                                  <span className="text-xs text-gray-500 ml-1">위</span>
                              </div>
                              <div className="font-medium truncate">{rank.nickname}</div>
                              <div className="text-center">
                                  {rank.stage}
                                  <span className="text-xs text-gray-500 ml-1">단계</span>
                              </div>
                              <div className="text-right font-medium text-primary">
                                  {rank.score.toLocaleString()}
                              </div>
                          </motion.div>
            ))}
                  </div>
              </div>
          </div>
      </div>
  )
}

export default RankingPage
