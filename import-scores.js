#!/usr/bin/env node

/**
 * 백업 파일에서 scores 데이터를 추출하여 새 Supabase에 삽입하는 스크립트
 * 
 * 사용법:
 *   node import-scores.js
 * 
 * 환경 변수:
 *   REACT_APP_SUPABASE_URL - Supabase 프로젝트 URL
 *   REACT_APP_SUPABASE_ANON_KEY - Supabase Anon Key
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// .env 파일 로드 (있는 경우)
const envFile = path.join(__dirname, '.env')
try {
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8')
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
          process.env[key.trim()] = value
        }
      }
    })
  }
} catch (error) {
  // .env 파일 읽기 실패 시 무시 (환경 변수는 이미 설정되어 있을 수 있음)
  console.log('ℹ️  .env 파일을 읽을 수 없습니다. 환경 변수가 이미 설정되어 있는지 확인하세요.')
}

// 환경 변수 확인
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.error('REACT_APP_SUPABASE_URL과 REACT_APP_SUPABASE_ANON_KEY를 설정해주세요.')
  console.error('\n.env 파일을 확인하거나 다음 명령어로 설정하세요:')
  console.error('  export REACT_APP_SUPABASE_URL=your_url')
  console.error('  export REACT_APP_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 백업 파일 경로
const backupFile = path.join(__dirname, 'backups', 'db_cluster-11-09-2025@15-17-06.backup')

if (!fs.existsSync(backupFile)) {
  console.error(`❌ 백업 파일을 찾을 수 없습니다: ${backupFile}`)
  process.exit(1)
}

// 백업 파일에서 scores 데이터 추출
function extractScoresData(backupContent) {
  const lines = backupContent.split('\n')
  const scoresStartIndex = lines.findIndex(line => line.startsWith('COPY public.scores'))
  
  if (scoresStartIndex === -1) {
    throw new Error('백업 파일에서 scores 테이블을 찾을 수 없습니다.')
  }

  const scoresData = []
  let inScoresData = false

  for (let i = scoresStartIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('COPY public.scores')) {
      inScoresData = true
      continue
    }
    
    if (line === '\\.' || line === '.') {
      break
    }
    
    if (inScoresData && line) {
      // 탭으로 구분된 데이터 파싱
      const parts = line.split('\t')
      if (parts.length === 5) {
        scoresData.push({
          id: parts[0],
          created_at: parts[1],
          nickname: parts[2],
          stage: parseInt(parts[3], 10),
          score: parseInt(parts[4], 10)
        })
      }
    }
  }

  return scoresData
}

// 데이터를 배치로 나누어 삽입
async function insertScoresInBatches(scoresData, batchSize = 100) {
  const total = scoresData.length
  let inserted = 0
  let errors = 0

  console.log(`📊 총 ${total}개의 레코드를 삽입합니다...`)
  console.log(`📦 배치 크기: ${batchSize}\n`)

  for (let i = 0; i < scoresData.length; i += batchSize) {
    const batch = scoresData.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1
    const totalBatches = Math.ceil(total / batchSize)

    try {
      const { data, error } = await supabase
        .from('scores')
        .insert(batch)

      if (error) {
        console.error(`❌ 배치 ${batchNum}/${totalBatches} 삽입 실패:`, error.message)
        errors += batch.length
      } else {
        inserted += batch.length
        const progress = ((inserted / total) * 100).toFixed(1)
        console.log(`✅ 배치 ${batchNum}/${totalBatches} 완료 (${inserted}/${total}, ${progress}%)`)
      }
    } catch (error) {
      console.error(`❌ 배치 ${batchNum}/${totalBatches} 오류:`, error.message)
      errors += batch.length
    }
  }

  return { inserted, errors, total }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🎨 Color Quiz - Scores 데이터 가져오기')
    console.log('=====================================\n')

    // 백업 파일 읽기
    console.log('📖 백업 파일 읽는 중...')
    const backupContent = fs.readFileSync(backupFile, 'utf-8')
    console.log('✅ 백업 파일 읽기 완료\n')

    // scores 데이터 추출
    console.log('🔍 scores 데이터 추출 중...')
    const scoresData = extractScoresData(backupContent)
    console.log(`✅ ${scoresData.length}개의 레코드를 추출했습니다.\n`)

    if (scoresData.length === 0) {
      console.log('⚠️  삽입할 데이터가 없습니다.')
      return
    }

    // 기존 데이터 확인
    console.log('🔍 기존 데이터 확인 중...')
    const { count: existingCount } = await supabase
      .from('scores')
      .select('*', { count: 'exact', head: true })

    if (existingCount > 0) {
      console.log(`⚠️  기존 데이터가 ${existingCount}개 있습니다.`)
      console.log('   기존 데이터를 삭제하고 새로 삽입하시겠습니까?')
      console.log('   (이 스크립트는 기존 데이터를 유지하고 추가만 합니다)')
      console.log('   기존 데이터를 삭제하려면 Supabase Dashboard에서 직접 삭제하세요.\n')
    } else {
      console.log('✅ 기존 데이터 없음\n')
    }

    // 데이터 삽입
    const result = await insertScoresInBatches(scoresData)

    console.log('\n=====================================')
    console.log('📊 삽입 결과:')
    console.log(`   성공: ${result.inserted}개`)
    console.log(`   실패: ${result.errors}개`)
    console.log(`   전체: ${result.total}개`)
    console.log('=====================================\n')

    if (result.errors > 0) {
      console.log('⚠️  일부 데이터 삽입에 실패했습니다. 위의 오류 메시지를 확인하세요.')
      process.exit(1)
    } else {
      console.log('✅ 모든 데이터가 성공적으로 삽입되었습니다!')
    }
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// 스크립트 실행
main()

