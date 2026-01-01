# color-quiz

다른 색깔 찾기 게임

## 설정

### Supabase 설정

이 프로젝트는 Supabase를 사용하여 점수 랭킹을 저장합니다. 상세한 설정 방법은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)를 참고하세요.

**빠른 시작:**

1. [Supabase Dashboard](https://app.supabase.com/)에서 새 프로젝트 생성
2. 환경 변수 설정 (두 가지 방법 중 선택):
   
   **방법 1: 자동 설정 스크립트 사용 (권장)**
   ```bash
   ./setup-env.sh
   ```
   스크립트가 Supabase URL과 Key를 입력받아 `.env` 파일을 자동으로 생성합니다.
   
   **방법 2: 수동 설정**
   프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Supabase Dashboard > Settings > API에서 URL과 Anon Key를 확인할 수 있습니다.

3. 데이터베이스 설정 (두 가지 방법 중 선택):
   
   **방법 A: 백업 파일 복원 (기존 데이터 포함)**
   - 백업 파일이 있는 경우: `./restore-backup.sh` 실행
   - Supabase CLI 또는 Dashboard를 통해 백업 복원
   - 자세한 내용은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고
   
   **방법 B: 새로 시작 (빈 데이터베이스)**
   - Supabase Dashboard > SQL Editor 열기
   - `supabase_schema.sql` 파일의 내용을 복사하여 실행
   - `scores` 테이블과 필요한 정책이 생성됩니다

4. 백업 데이터 가져오기 (선택사항):
   
   백업 파일에서 scores 데이터만 가져오려면:
   ```bash
   node import-scores.js
   ```
   
   이 스크립트는:
   - 백업 파일에서 scores 테이블 데이터를 추출
   - 새 Supabase 프로젝트에 배치로 삽입
   - 진행 상황과 결과를 표시
   
   **참고**: `.env` 파일이 있으면 자동으로 로드되며, 없으면 환경 변수가 이미 설정되어 있어야 합니다.

5. 개발 서버 시작:
   ```bash
   npm install
   npm start
   ```

### 배포

https://pick-color.netlify.app/
