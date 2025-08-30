import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { supabase } from '@/lib/supabase'
import type { Score } from '@/lib/supabase'

const RankingPage = () => {
  const [ranks, setRanks] = useState<Score[]>([])

  useEffect(() => {
    const getRanks = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(10)

        if (error) {
          throw error
        }

        setRanks(data || [])
      } catch (error) {
        console.error('Error fetching ranks:', error)
      }
    }

    getRanks()
  }, [])

  return (
      <div className="container max-w-2xl mx-auto px-4">
          <div className="mt-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden dark:bg-gray-200/50">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400 dark:border-gray-300 dark:text-gray-600">
                      <div>순위</div>
                      <div>닉네임</div>
                      <div className="text-center">단계</div>
                      <div className="text-right">점수</div>
                  </div>
                  <div className="divide-y divide-gray-700 dark:divide-gray-300">
                      {ranks.map((rank, index) => (
                          <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-700/30 transition-colors dark:hover:bg-gray-300/30"
              >
                              <div className="font-medium">
                                  {index + 1}
                                  <span className="text-xs text-gray-500 dark:text-gray-600 ml-1">위</span>
                              </div>
                              <div className="font-medium truncate">{rank.nickname}</div>
                              <div className="text-center">
                                  {rank.stage}
                                  <span className="text-xs text-gray-500 dark:text-gray-600 ml-1">단계</span>
                              </div>
                              <div className="text-right font-medium">
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
