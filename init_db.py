"""
MongoDB 초기 데이터 설정 스크립트
Flask 서버 실행 전에 한 번 실행하여 샘플 데이터를 생성합니다.
"""

from pymongo import MongoClient
from datetime import datetime
import json

# MongoDB 연결
client = MongoClient('mongodb+srv://woo15907:Gzoro15907@cluster0.fkjfyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true', 27017)
db = client['econolearn']

def init_economic_terms():
    """경제 용어 초기 데이터 생성"""
    terms_collection = db['economic_terms']
    
    # 기존 데이터 삭제
    terms_collection.delete_many({})
    
    sample_terms = [
        {
            "term": "GDP",
            "definition": "국내총생산(Gross Domestic Product)으로, 한 나라에서 일정 기간 동안 생산된 모든 재화와 서비스의 시장가치 총합",
            "example": "2023년 한국의 GDP는 약 2조 달러로, 세계 10위 수준입니다.",
            "difficulty": 1,
            "category": "거시경제",
            "related_terms": ["GNP", "경제성장률", "인플레이션"],
            "created_at": datetime.utcnow()
        },
        {
            "term": "인플레이션",
            "definition": "물가가 지속적으로 상승하는 현상으로, 화폐의 구매력이 감소하는 것을 의미",
            "example": "최근 유가 상승으로 인해 인플레이션이 심화되고 있습니다.",
            "difficulty": 1,
            "category": "거시경제",
            "related_terms": ["디플레이션", "물가지수", "금리"],
            "created_at": datetime.utcnow()
        },
        {
            "term": "PER",
            "definition": "주가수익비율(Price Earnings Ratio)로, 주가를 주당순이익으로 나눈 값. 주식의 상대적 가치를 평가하는 지표",
            "example": "삼성전자의 PER이 15배라면, 현재 주가가 1년 순이익의 15배라는 의미입니다.",
            "difficulty": 2,
            "category": "투자분석",
            "related_terms": ["PBR", "ROE", "EPS"],
            "created_at": datetime.utcnow()
        },
        {
            "term": "ROE",
            "definition": "자기자본이익률(Return On Equity)로, 기업이 자기자본을 얼마나 효율적으로 활용하여 이익을 창출했는지 나타내는 지표",
            "example": "ROE가 15%인 기업은 자기자본 100원으로 15원의 순이익을 창출했다는 의미입니다.",
            "difficulty": 2,
            "category": "재무분석",
            "related_terms": ["ROA", "PER", "부채비율"],
            "created_at": datetime.utcnow()
        },
        {
            "term": "샤프비율",
            "definition": "위험 대비 수익률을 측정하는 지표로, 무위험수익률을 초과하는 수익률을 변동성으로 나눈 값",
            "example": "샤프비율이 1.5인 포트폴리오는 위험 단위당 1.5의 초과수익을 제공한다는 의미입니다.",
            "difficulty": 3,
            "category": "포트폴리오",
            "related_terms": ["베타", "알파", "변동성"],
            "created_at": datetime.utcnow()
        }
    ]
    
    terms_collection.insert_many(sample_terms)
    print(f"경제 용어 {len(sample_terms)}개 생성 완료")

def init_companies():
    """기업 정보 초기 데이터 생성"""
    companies_collection = db['companies']
    
    # 기존 데이터 삭제
    companies_collection.delete_many({})
    
    sample_companies = [
        {
            "name": "삼성전자",
            "symbol": "005930",
            "sector": "기술",
            "market_cap": 400000000,  # 4000억 달러
            "description": "글로벌 반도체 및 전자제품 제조업체",
            "created_at": datetime.utcnow()
        },
        {
            "name": "SK하이닉스",
            "symbol": "000660",
            "sector": "기술",
            "market_cap": 80000000,
            "description": "메모리 반도체 전문 기업",
            "created_at": datetime.utcnow()
        },
        {
            "name": "NAVER",
            "symbol": "035420",
            "sector": "인터넷",
            "market_cap": 30000000,
            "description": "국내 최대 포털 및 IT 서비스 기업",
            "created_at": datetime.utcnow()
        },
        {
            "name": "카카오",
            "symbol": "035720",
            "sector": "인터넷",
            "market_cap": 25000000,
            "description": "모바일 플랫폼 및 콘텐츠 서비스 기업",
            "created_at": datetime.utcnow()
        },
        {
            "name": "현대자동차",
            "symbol": "005380",
            "sector": "자동차",
            "market_cap": 35000000,
            "description": "글로벌 자동차 제조업체",
            "created_at": datetime.utcnow()
        }
    ]
    
    companies_collection.insert_many(sample_companies)
    print(f"기업 정보 {len(sample_companies)}개 생성 완료")

def init_quizzes():
    """퀴즈 초기 데이터 생성"""
    quizzes_collection = db['quizzes']
    
    # 기존 데이터 삭제
    quizzes_collection.delete_many({})
    
    sample_quizzes = [
        {
            "title": "기초 경제학",
            "description": "GDP, 인플레이션 등 기본 경제 개념을 다루는 퀴즈",
            "difficulty": 1,
            "category": "거시경제",
            "question_count": 5,
            "estimated_time": 5,
            "questions": [
                {
                    "question": "GDP는 무엇의 줄임말인가요?",
                    "options": [
                        "Gross Domestic Product",
                        "General Development Program", 
                        "Global Distribution Policy",
                        "Government Debt Program"
                    ],
                    "correct_answer": 0,
                    "explanation": "GDP는 Gross Domestic Product(국내총생산)의 줄임말로, 한 나라의 경제 규모를 나타내는 지표입니다."
                },
                {
                    "question": "인플레이션이란 무엇인가요?",
                    "options": [
                        "물가가 지속적으로 하락하는 현상",
                        "물가가 지속적으로 상승하는 현상",
                        "환율이 상승하는 현상",
                        "금리가 하락하는 현상"
                    ],
                    "correct_answer": 1,
                    "explanation": "인플레이션은 물가가 지속적으로 상승하여 화폐의 구매력이 감소하는 현상입니다."
                }
            ],
            "created_at": datetime.utcnow()
        },
        {
            "title": "투자 분석 기초",
            "description": "PER, ROE 등 기본적인 투자 지표를 다루는 퀴즈",
            "difficulty": 2,
            "category": "투자분석",
            "question_count": 4,
            "estimated_time": 6,
            "questions": [
                {
                    "question": "PER이 15배라는 것은 무엇을 의미하나요?",
                    "options": [
                        "주가가 순자산의 15배",
                        "주가가 연간 순이익의 15배",
                        "배당수익률이 15%",
                        "부채비율이 15%"
                    ],
                    "correct_answer": 1,
                    "explanation": "PER(주가수익비율)이 15배라는 것은 현재 주가가 연간 주당순이익의 15배라는 의미입니다."
                }
            ],
            "created_at": datetime.utcnow()
        }
    ]
    
    quizzes_collection.insert_many(sample_quizzes)
    print(f"퀴즈 {len(sample_quizzes)}개 생성 완료")

def create_indexes():
    """데이터베이스 인덱스 생성"""
    # 사용자 컬렉션 인덱스
    db['users'].create_index("user_id", unique=True)
    db['users'].create_index("email", unique=True)
    
    # 경제 용어 컬렉션 인덱스
    db['economic_terms'].create_index("term")
    db['economic_terms'].create_index("category")
    db['economic_terms'].create_index("difficulty")
    
    # 기업 컬렉션 인덱스
    db['companies'].create_index("symbol", unique=True)
    db['companies'].create_index("name")
    db['companies'].create_index("sector")
    
    print("데이터베이스 인덱스 생성 완료")

if __name__ == "__main__":
    print("EconoLearn 데이터베이스 초기화를 시작합니다...")
    
    try:
        init_economic_terms()
        init_companies()
        init_quizzes()
        create_indexes()
        
        print("\n✅ 데이터베이스 초기화가 완료되었습니다!")
        print("이제 Flask 서버를 실행할 수 있습니다: python app.py")
        
    except Exception as e:
        print(f"❌ 데이터베이스 초기화 중 오류 발생: {e}")
