import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { supabase } from '@/lib/supabase'
import type { Score } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  
  const fullDatePart = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '')

  const shortDatePart = date.toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '')

  const timePart = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(' ', '')

  return { fullDatePart, shortDatePart, timePart }
}

const RankingPage = () => {
  const [ranks, setRanks] = useState<Score[]>([])

  useEffect(() => {
    const getRanks = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(100)

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
      <div className="flex flex-col min-h-screen">
          <div className="container mx-auto px-1 sm:px-4 py-4 flex-1">
              <div className="h-full flex flex-col">
                  <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden dark:bg-gray-200/50">
                      <div className="sticky top-0 grid grid-cols-[2rem_1fr_2.5rem_3.5rem_3rem] sm:grid-cols-6 gap-1 sm:gap-4 p-2 sm:p-4 border-b border-gray-700 text-xs sm:text-sm font-medium text-gray-400 dark:border-gray-300 dark:text-gray-600 bg-inherit">
                          <div>순위</div>
                          <div className="sm:col-span-2">닉네임</div>
                          <div className="text-center">단계</div>
                          <div className="text-right">점수</div>
                          <div className="text-right">일시</div>
                      </div>
                      <div className="divide-y divide-gray-700 dark:divide-gray-300 max-h-[calc(100vh-8rem)] overflow-y-auto">
                          {ranks.map((rank, index) => (
                              <motion.div
                  key={rank.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 1) }}
                  className={cn(
                    "grid grid-cols-[2rem_1fr_2.5rem_3.5rem_3rem] sm:grid-cols-6 gap-1 sm:gap-4 p-2 sm:p-4 items-center hover:bg-gray-700/30 transition-colors dark:hover:bg-gray-300/30 text-xs sm:text-sm",
                    index < 10 && "bg-yellow-500/5"
                  )}
                >
                                  <div className="font-medium">
                                      {index < 3 ? (
                                          <span className="text-lg" aria-label={`${index + 1}등`}>
                                              {index === 0 && '🥇'}
                                              {index === 1 && '🥈'}
                                              {index === 2 && '🥉'}
                                          </span>
                                      ) : (
                                          <>
                                              {index + 1}
                                              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-600 ml-0.5">위</span>
                                          </>
                                      )}
                                  </div>
                                  <div className={cn(
                                    "font-medium truncate sm:col-span-2",
                                    index < 3 && "text-sm sm:text-base"
                                  )}>
                                      {rank.nickname}
                                  </div>
                                  <div className="text-center">
                                      {rank.stage}
                                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-600 ml-0.5">단계</span>
                                  </div>
                                  <div className={cn(
                                    "text-right tabular-nums",
                                    index < 3 && "text-sm sm:text-base font-bold"
                                  )}>
                                      {rank.score.toLocaleString()}
                                  </div>
                                  <div className="text-right text-gray-500 dark:text-gray-600">
                                      <div className="text-[10px] leading-tight">
                                          <span className="hidden sm:inline">{formatDate(rank.created_at).fullDatePart}</span>
                                          <span className="sm:hidden">{formatDate(rank.created_at).shortDatePart}</span>
                                      </div>
                                      <div className="text-[10px] leading-tight">{formatDate(rank.created_at).timePart}</div>
                                  </div>
                              </motion.div>
              ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default RankingPage
