from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from flask import Flask, request, jsonify

# --- FastAPI 앱 및 MongoDB 설정 ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 *로 두고, 배포 시에는 실제 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb+srv://woo15907:Gzoro15907@cluster0.fkjfyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true', 27017)
db = client['econolearn']
users_collection = db['users']

# --- Pydantic 모델 정의 (데이터 형태 선언) ---
# 데이터 유효성 검사, JSON 변환
class UserRegister(BaseModel):
    user_id: str
    password: str
    name: str
    age: int
    email: EmailStr  # 이메일 형식 자동 검증
    know_level: int
    like_company : list[str]
    like_category : list[str]
    
class UserRefresh(BaseModel):
    name : str
    age : int
    email : EmailStr
    know_level: int
    like_company : list[str]
    like_category : list[str]
    
class UserLogin(BaseModel):
    user_id: str
    password: str

# --- EconomicTerm 모델 정의 ---
class EconomicTermModel(BaseModel):
    id: str
    term: str
    definition: str
    example: str
    difficulty: int
    category: str
    relatedTerms: list[str]

# --- API 라우트 정의 ---

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):  # 들어오는 데이터 : UserRegister 모델
    # user_id 중복 확인
    if users_collection.find_one({'user_id': user.user_id}):
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다")
    
    # 이메일 중복 확인
    if users_collection.find_one({'email': user.email}):
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다")

    # FastAPI가 자동으로 user.user_id, user.password 등을 검증

    hashed_password = generate_password_hash(user.password)
    
    #Pydantic 모델을 딕셔너리로 변환
    user_data = user.dict()
    user_data['password'] = hashed_password
    
    users_collection.insert_one(user_data)
    
    return {"message": "회원가입이 완료되었습니다", "user_id": user.user_id}

@app.post("/api/auth/login")
def login(user: UserLogin):
    user_in_db = users_collection.find_one({'user_id': user.user_id})
    if not user_in_db:
        raise HTTPException(status_code=400, detail="존재하지 않는 사용자 ID입니다")
    if not check_password_hash(user_in_db['password'], user.password):
        raise HTTPException(status_code=400, detail="비밀번호가 올바르지 않습니다")
    # 로그인 성공 시 필요한 정보만 반환
    return {
        "user_id": user_in_db["user_id"],
        "name": user_in_db.get("name", ""),
        "know_level": user_in_db.get("know_level", 0),
        "email": user_in_db.get("email", ""),
        "message": "로그인 성공"
    }
    
@app.post("/api/profile/refresh")
def refresh(user: UserRefresh):
    return 0
    

@app.get("/api/dictionary/terms")
def get_economic_terms():
    terms = []
    for doc in db['economic_terms'].find():
        terms.append({
            "id": str(doc.get("_id", "")),
            "term": doc["term"],
            "definition": doc["definition"],
            "example": doc["example"],
            "difficulty": doc["difficulty"],
            "category": doc["category"],
            "relatedTerms": doc.get("related_terms", []),
        })
    return terms

@app.get('/api/quiz/collections')
def get_quiz_collections():
    """사용 가능한 문제집 목록 반환"""
    try:
        collections = [
            # 1단계
            {"id": "level1-economy", "title": "1단계 경제 용어 문제집", "difficulty": 1, "category": "경제", "count": 30},
            {"id": "level1-finance", "title": "1단계 금융 경제용어 문제집", "difficulty": 1, "category": "금융", "count": 30},
            {"id": "level1-all", "title": "1단계 모든 경제 용어 문제집", "difficulty": 1, "category": "all", "count": 30},
            # 2단계
            {"id": "level2-economy", "title": "2단계 경제 용어 문제집", "difficulty": 2, "category": "경제", "count": 30},
            {"id": "level2-finance", "title": "2단계 금융 경제용어 문제집", "difficulty": 2, "category": "금융", "count": 30},
            {"id": "level2-all", "title": "2단계 모든 경제 용어 문제집", "difficulty": 2, "category": "all", "count": 30},
            # 3단계
            {"id": "level3-economy", "title": "3단계 경제 용어 문제집", "difficulty": 3, "category": "경제", "count": 30},
            {"id": "level3-finance", "title": "3단계 금융 경제용어 문제집", "difficulty": 3, "category": "금융", "count": 30},
            {"id": "level3-all", "title": "3단계 모든 경제 용어 문제집", "difficulty": 3, "category": "all", "count": 30},
            # 종합
            {"id": "all-comprehensive", "title": "모든 경제용어 종합 문제집", "difficulty": 0, "category": "all", "count": 50},
        ]
        
        return collections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/api/quiz/generate/{collection_id}')
def generate_quiz(collection_id: str):
    """문제집 ID에 따라 랜덤 문제 생성"""
    try:
        quizzes_collection = db['quizzes']
        
        # collection_id 파싱
        parts = collection_id.split('-')
        
        if collection_id == "all-comprehensive":
            # 모든 문제에서 50개 랜덤 선택
            pipeline = [
                {"$sample": {"size": 50}}
            ]
        else:
            difficulty = int(parts[0].replace('level', ''))
            category = parts[1]
            
            # 필터 조건 생성
            match_condition = {"difficulty": difficulty}
            if category != "all":
                match_condition["category"] = category
            
            # 해당 조건의 문제 30개 랜덤 선택
            pipeline = [
                {"$match": match_condition},
                {"$sample": {"size": 30}}
            ]
        
        questions = list(quizzes_collection.aggregate(pipeline))
        
        # ObjectId를 문자열로 변환
        for q in questions:
            q['_id'] = str(q['_id'])
        
        return {
            "collection_id": collection_id,
            "questions": questions,
            "total": len(questions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/api/quiz/submit')
def submit_quiz_results(data: dict):
    """퀴즈 결과 제출 및 틀린 문제 저장"""
    try:
        user_id = data.get('user_id')
        wrong_question_ids = data.get('wrong_question_ids', [])  # 틀린 문제의 _id 리스트
        
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        users_collection = db['users']
        
        # 사용자 찾기
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # no_corrects 필드가 없으면 생성
        if 'no_corrects' not in user:
            user['no_corrects'] = []
        
        # 틀린 문제 ID 추가 (중복 제거)
        existing_ids = set(user['no_corrects'])
        new_ids = set(wrong_question_ids)
        updated_ids = list(existing_ids.union(new_ids))
        
        # 데이터베이스 업데이트
        users_collection.update_one(
            {"user_id": user_id},
            {"$set": {"no_corrects": updated_ids}}
        )
        
        return {
            "success": True,
            "total_wrong_questions": len(updated_ids)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/api/quiz/review/{user_id}')
def get_review_questions(user_id: str):
    """사용자의 틀린 문제 목록 가져오기"""
    try:
        users_collection = db['users']
        quizzes_collection = db['quizzes']
        
        # 사용자 찾기
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 틀린 문제 ID 가져오기
        wrong_question_ids = user.get('no_corrects', [])
        
        if not wrong_question_ids:
            return {
                "questions": [],
                "total": 0
            }
        
        # ObjectId로 변환
        object_ids = [ObjectId(qid) for qid in wrong_question_ids if ObjectId.is_valid(qid)]
        
        # 문제 가져오기
        questions = list(quizzes_collection.find({"_id": {"$in": object_ids}}))
        
        # ObjectId를 문자열로 변환
        for q in questions:
            q['_id'] = str(q['_id'])
        
        return {
            "questions": questions,
            "total": len(questions)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/api/quiz/review/submit')
def submit_review_results(data: dict):
    """복습 결과 제출 및 맞은 문제 제거"""
    try:
        user_id = data.get('user_id')
        correct_question_ids = data.get('correct_question_ids', [])  # 맞은 문제의 _id 리스트
        
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        users_collection = db['users']
        
        # 사용자 찾기
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 현재 틀린 문제 목록
        current_wrong = set(user.get('no_corrects', []))
        
        # 맞은 문제 제거
        updated_wrong = list(current_wrong - set(correct_question_ids))
        
        # 데이터베이스 업데이트
        users_collection.update_one(
            {"user_id": user_id},
            {"$set": {"no_corrects": updated_wrong}}
        )
        
        return {
            "success": True,
            "remaining_wrong_questions": len(updated_wrong)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/api/quiz/stats/{user_id}')
def get_user_quiz_stats(user_id: str):
    """사용자의 퀴즈 통계 가져오기"""
    try:
        users_collection = db['users']
        
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        wrong_count = len(user.get('no_corrects', []))
        
        return {
            "user_id": user_id,
            "wrong_questions_count": wrong_count
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))