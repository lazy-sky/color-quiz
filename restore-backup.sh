#!/bin/bash

# Color Quiz - Supabase 백업 복원 스크립트
# 이 스크립트는 Supabase 백업 파일을 새 프로젝트에 복원하는 데 도움을 줍니다.

BACKUP_FILE="/Users/ratel/Downloads/db_cluster-11-09-2025@15-17-06.backup"
PROJECT_BACKUP_DIR="./backups"

echo "🎨 Color Quiz - Supabase 백업 복원"
echo "=================================="
echo ""

# 백업 파일 확인
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
    exit 1
fi

echo "✅ 백업 파일 확인: $BACKUP_FILE"
echo ""

# 프로젝트 백업 디렉토리 생성
mkdir -p "$PROJECT_BACKUP_DIR"

# 백업 파일을 프로젝트 디렉토리로 복사
BACKUP_NAME=$(basename "$BACKUP_FILE")
PROJECT_BACKUP="$PROJECT_BACKUP_DIR/$BACKUP_NAME"

if [ ! -f "$PROJECT_BACKUP" ]; then
    echo "📋 백업 파일을 프로젝트 디렉토리로 복사 중..."
    cp "$BACKUP_FILE" "$PROJECT_BACKUP"
    echo "✅ 복사 완료: $PROJECT_BACKUP"
else
    echo "ℹ️  백업 파일이 이미 존재합니다: $PROJECT_BACKUP"
fi

echo ""
echo "📝 백업 복원 방법:"
echo ""
echo "방법 1: Supabase CLI 사용 (권장)"
echo "--------------------------------"
echo "1. Supabase CLI 설치 (아직 설치하지 않은 경우):"
echo "   brew install supabase/tap/supabase"
echo ""
echo "2. Supabase에 로그인:"
echo "   supabase login"
echo ""
echo "3. 새 프로젝트 연결:"
echo "   supabase link --project-ref your-project-ref"
echo ""
echo "4. 백업 복원:"
echo "   supabase db restore $PROJECT_BACKUP"
echo ""
echo ""
echo "방법 2: Supabase Dashboard 사용"
echo "--------------------------------"
echo "1. Supabase Dashboard > Database > Backups로 이동"
echo "2. 'Restore from backup' 클릭"
echo "3. 백업 파일 업로드: $PROJECT_BACKUP"
echo ""
echo ""
echo "방법 3: pg_restore 사용 (고급)"
echo "--------------------------------"
echo "1. Supabase Dashboard > Settings > Database에서 연결 정보 확인"
echo "2. 다음 명령어 실행:"
echo "   pg_restore -h [HOST] -U postgres -d postgres --clean --if-exists $PROJECT_BACKUP"
echo ""
echo ""
echo "⚠️  참고:"
echo "- 백업 복원 전에 새 프로젝트의 데이터베이스가 비어있어야 합니다"
echo "- 백업 파일에는 scores 테이블과 데이터가 포함되어 있습니다"
echo "- 복원 후 RLS 정책이 올바르게 설정되었는지 확인하세요"
echo ""

