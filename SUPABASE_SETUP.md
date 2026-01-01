# Supabase 설정 가이드

이 프로젝트는 Supabase를 사용하여 점수 랭킹 데이터를 저장합니다.

## 1. 새로운 Supabase 프로젝트 생성

1. [Supabase Dashboard](https://app.supabase.com/)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 설정 후 프로젝트 생성

## 2. 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고)
2. Supabase Dashboard에서 다음 정보를 복사:
   - **Project URL**: Settings > API > Project URL
   - **Anon Key**: Settings > API > Project API keys > `anon` `public` 키

3. `.env` 파일에 다음과 같이 설정:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. 데이터베이스 스키마 생성

Supabase Dashboard에서 SQL Editor를 열고 다음 SQL을 실행하세요:

```sql
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
```

## 4. 백업 데이터 복원

백업 파일이 있는 경우 (`backups/db_cluster-11-09-2025@15-17-06.backup`):

### 방법 1: Supabase CLI 사용 (권장)

1. **Supabase CLI 설치** (아직 설치하지 않은 경우):
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Supabase에 로그인**:
   ```bash
   supabase login
   ```

3. **새 프로젝트 연결**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   프로젝트 ref는 Supabase Dashboard > Settings > General에서 확인할 수 있습니다.

4. **백업 복원**:
   ```bash
   supabase db restore backups/db_cluster-11-09-2025@15-17-06.backup
   ```

### 방법 2: Supabase Dashboard 사용

1. Supabase Dashboard > Database > Backups로 이동
2. "Restore from backup" 또는 "Upload backup" 클릭
3. `backups/db_cluster-11-09-2025@15-17-06.backup` 파일 업로드
4. 복원 진행

### 방법 3: pg_restore 사용 (고급)

1. **Supabase Dashboard에서 연결 정보 확인**:
   - Settings > Database > Connection string
   - 또는 Connection pooling > Session mode에서 확인

2. **pg_restore 명령어 실행**:
   ```bash
   pg_restore \
     -h [HOST] \
     -U postgres \
     -d postgres \
     --clean \
     --if-exists \
     --no-owner \
     --no-privileges \
     backups/db_cluster-11-09-2025@15-17-06.backup
   ```
   
   또는 psql을 사용:
   ```bash
   psql [CONNECTION_STRING] < backups/db_cluster-11-09-2025@15-17-06.backup
   ```

### 백업 복원 스크립트 사용

프로젝트에 포함된 복원 스크립트를 실행하면 자세한 안내를 받을 수 있습니다:

```bash
./restore-backup.sh
```

### 주의사항

- 백업 복원 전에 새 프로젝트의 데이터베이스가 비어있어야 합니다
- 백업 파일에는 scores 테이블과 모든 데이터가 포함되어 있습니다
- 복원 후 RLS 정책이 올바르게 설정되었는지 확인하세요
- 복원 후 환경 변수가 올바르게 설정되었는지 확인하세요

## 5. 애플리케이션 실행

환경 변수를 설정한 후:

```bash
npm install
npm start
```

## 문제 해결

### 환경 변수가 로드되지 않는 경우
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확히 `.env`인지 확인 (`.env.local` 아님)
- 개발 서버를 재시작

### RLS 정책 오류가 발생하는 경우
- Supabase Dashboard > Authentication > Policies에서 정책이 올바르게 설정되었는지 확인
- 위의 SQL 스크립트를 다시 실행

### 연결 오류가 발생하는 경우
- Supabase 프로젝트가 활성화되어 있는지 확인
- URL과 Anon Key가 올바른지 확인
- 네트워크 연결 확인

