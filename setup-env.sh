#!/bin/bash

# Color Quiz - 환경 변수 설정 스크립트
# 이 스크립트는 .env 파일을 생성하는 데 도움을 줍니다.

echo "🎨 Color Quiz - Supabase 환경 변수 설정"
echo "========================================"
echo ""

# .env 파일이 이미 존재하는지 확인
if [ -f .env ]; then
    echo "⚠️  .env 파일이 이미 존재합니다."
    read -p "덮어쓰시겠습니까? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "취소되었습니다."
        exit 0
    fi
fi

echo ""
echo "Supabase 프로젝트 정보를 입력해주세요."
echo "(Supabase Dashboard > Settings > API에서 확인할 수 있습니다)"
echo ""

read -p "Supabase Project URL: " supabase_url
read -p "Supabase Anon Key: " supabase_key

# 입력값 검증
if [ -z "$supabase_url" ] || [ -z "$supabase_key" ]; then
    echo "❌ URL과 Key를 모두 입력해주세요."
    exit 1
fi

# .env 파일 생성
cat > .env << EOF
REACT_APP_SUPABASE_URL=$supabase_url
REACT_APP_SUPABASE_ANON_KEY=$supabase_key
EOF

echo ""
echo "✅ .env 파일이 생성되었습니다!"
echo ""
echo "다음 단계:"
echo "1. Supabase Dashboard의 SQL Editor에서 supabase_schema.sql 파일을 실행하세요"
echo "2. npm start로 개발 서버를 시작하세요"
echo ""

