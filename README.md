# Quant_project
퀀트분석과 모의투자 &amp; 경영 사전
# EconoLearn - 경제 학습 플랫폼

20대 대상 경제 교육을 위한 종합 학습 플랫폼입니다.

## 🚀 기능

- **회원가입/로그인**: JWT 기반 인증 시스템
- **경제사전**: 난이도별 경제 용어 학습
- **퀴즈 시스템**: 객관식 문제 풀이 및 복습
- **퀀트 분석**: 기업 재무제표 기반 투자 분석
- **개인화**: 사용자 레벨에 맞는 맞춤 추천

## 🛠 기술 스택

### Frontend
- Next.js 14 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI

### Backend
- Flask (Python)
- MongoDB
- JWT 인증
- CORS 지원

## 📦 설치 및 실행

### 1. 프로젝트 클론
\`\`\`bash
git clone <repository-url>
cd economic-learning-platform
\`\`\`

### 2. 프론트엔드 설정
\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
\`\`\`

### 3. 백엔드 설정
\`\`\`bash
# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Python 패키지 설치
pip install -r requirements.txt

# MongoDB 설치 및 실행 (별도 터미널)
# Windows: MongoDB Community Server 설치 후 서비스 시작
# macOS: brew install mongodb-community && brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 데이터베이스 초기화 (최초 1회)
python init_database.py

# Flask 서버 실행
python app.py
\`\`\`

### 4. 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## 📚 API 문서

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 경제사전
- `GET /api/dictionary/terms` - 경제 용어 목록
- `GET /api/dictionary/categories` - 카테고리 목록

### 퀴즈
- `GET /api/quiz/list` - 퀴즈 목록
- `GET /api/quiz/<id>` - 특정 퀴즈 조회
- `POST /api/quiz/submit` - 퀴즈 결과 제출

### 퀀트 분석
- `GET /api/analysis/companies` - 기업 목록
- `GET /api/analysis/metrics` - 분석 지표 목록
- `POST /api/analysis/calculate` - 분석 계산

### 사용자
- `GET /api/user/profile` - 프로필 조회
- `PUT /api/user/profile` - 프로필 업데이트

## 🔧 개발 가이드

### 환경 변수
Flask 서버의 `app.py`에서 다음 설정을 환경변수로 관리하는 것을 권장합니다:

\`\`\`python
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
\`\`\`

### 데이터베이스 스키마
- `users`: 사용자 정보
- `economic_terms`: 경제 용어
- `quizzes`: 퀴즈 데이터
- `quiz_results`: 퀴즈 결과
- `companies`: 기업 정보

## 🚀 배포

### 프론트엔드 (Vercel)
\`\`\`bash
npm run build
# Vercel에 배포
\`\`\`

### 백엔드 (Heroku/AWS/GCP)
\`\`\`bash
# requirements.txt와 app.py를 포함하여 배포
# MongoDB Atlas 사용 권장
\`\`\`

## 📝 라이센스

MIT License
