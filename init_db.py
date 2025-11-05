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
    
    # 경제용어.txt 파일 읽기
    try:
        with open('경제용어.txt', 'r', encoding='utf-8') as file:
            terms_data = json.load(file)
            
        # 데이터 삽입
        if terms_data:
            terms_collection.insert_many(terms_data)
            print(f"경제 용어 {len(terms_data)}개가 성공적으로 추가되었습니다.")
    except Exception as e:
        print(f"경제 용어 데이터 추가 중 오류 발생: {str(e)}")

def init_quizzes():
    """퀴즈 초기 데이터 생성"""
    quizzes_collection = db['quizzes']
    
    # 기존 데이터 삭제
    quizzes_collection.delete_many({})
    
    # 경제 퀴즈들.txt 파일 읽기
    try:
        with open('경제 퀴즈들.txt', 'r', encoding='utf-8') as file:
            quizzes_data = json.load(file)
            
        # 데이터 삽입
        if quizzes_data:
            quizzes_collection.insert_many(quizzes_data)
            print(f"퀴즈 {len(quizzes_data)}개가 성공적으로 추가되었습니다.")
    except Exception as e:
        print(f"퀴즈 데이터 추가 중 오류 발생: {str(e)}")

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
