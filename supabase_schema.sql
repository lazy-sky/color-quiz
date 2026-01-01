-- Color Quiz - Supabase Database Schema
-- 이 파일을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- scores 테이블 생성
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  nickname TEXT NOT NULL,
  stage INTEGER NOT NULL,
  score INTEGER NOT NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_scores_score_desc ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);

-- Row Level Security (RLS) 설정
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Anyone can read scores"
  ON scores
  FOR SELECT
  USING (true);

-- 모든 사용자가 점수 삽입 가능하도록 정책 설정
CREATE POLICY "Anyone can insert scores"
  ON scores
  FOR INSERT
  WITH CHECK (true);

