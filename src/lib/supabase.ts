import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('REACT_APP_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('REACT_APP_SUPABASE_ANON_KEY')
  
  console.error(
    `❌ Supabase 환경 변수가 설정되지 않았습니다.\n` +
    `누락된 변수: ${missingVars.join(', ')}\n\n` +
    `설정 방법:\n` +
    `1. 프로젝트 루트에 .env 파일을 생성하세요\n` +
    `2. 다음 내용을 추가하세요:\n` +
    `   REACT_APP_SUPABASE_URL=your_supabase_project_url\n` +
    `   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n` +
    `자세한 내용은 SUPABASE_SETUP.md를 참고하세요.`
  )
  
  // 개발 환경에서는 더 명확한 에러 메시지 표시
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `Supabase 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}\n` +
      `SUPABASE_SETUP.md 파일을 참고하여 설정해주세요.`
    )
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export type Score = {
  id: string
  created_at: string
  nickname: string
  stage: number
  score: number
} 