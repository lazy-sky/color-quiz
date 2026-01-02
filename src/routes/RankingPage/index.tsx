import { useEffect, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)
  const MAX_RANKS = 500

  useEffect(() => {
    const loadRanks = async () => {
      try {
        setIsLoading(true)
        
        // 환경 변수 확인
        if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
          console.warn('Supabase 환경 변수가 설정되지 않아 랭킹을 불러올 수 없습니다.')
          setRanks([])
          return
        }

        // 상위 500개만 가져오기
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(MAX_RANKS)

        if (error) {
          throw error
        }

        setRanks(data || [])
      } catch (error) {
        console.error('Error fetching ranks:', error)
        setRanks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRanks()
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
                      <div className="divide-y divide-gray-700 dark:divide-gray-300 max-h-[calc(100vh-12rem)] overflow-y-auto">
                          {ranks.length === 0 && isLoading ? (
                              <div className="flex justify-center items-center py-12">
                                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent"></div>
                                      <span className="text-sm">랭킹을 불러오는 중...</span>
                                  </div>
                              </div>
                          ) : ranks.length === 0 && !isLoading ? (
                              <div className="flex justify-center items-center py-12">
                                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                                      랭킹 데이터가 없습니다
                                  </div>
                              </div>
                          ) : (
                              <>
                                  {ranks.map((rank, index) => {
                                      const rankNum = index + 1
                                      return (
                                          <div
                                              key={rank.id}
                                              className={cn(
                                                  "grid grid-cols-[2rem_1fr_2.5rem_3.5rem_3rem] sm:grid-cols-6 gap-1 sm:gap-4 p-2 sm:p-4 items-center hover:bg-gray-700/30 transition-colors dark:hover:bg-gray-300/30 text-xs sm:text-sm",
                                                  rankNum <= 10 && "bg-yellow-500/5"
                                              )}
                                          >
                                              <div className="font-medium">
                                                  {rankNum <= 3 ? (
                                                      <span className="text-lg" aria-label={`${rankNum}등`}>
                                                          {rankNum === 1 && '🥇'}
                                                          {rankNum === 2 && '🥈'}
                                                          {rankNum === 3 && '🥉'}
                                                      </span>
                                                  ) : (
                                                      <>
                                                          {rankNum}
                                                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-600 ml-0.5">위</span>
                                                      </>
                                                  )}
                                              </div>
                                              <div className={cn(
                                                  "font-medium truncate sm:col-span-2",
                                                  rankNum <= 3 && "text-sm sm:text-base"
                                              )}>
                                                  {rank.nickname}
                                              </div>
                                              <div className="text-center">
                                                  {rank.stage}
                                                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-600 ml-0.5">단계</span>
                                              </div>
                                              <div className={cn(
                                                  "text-right tabular-nums",
                                                  rankNum <= 3 && "text-sm sm:text-base font-bold"
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
                                          </div>
                                      )
                                  })}
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default RankingPage
