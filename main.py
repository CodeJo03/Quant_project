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
    allow_origins=["*"],  # !!! 개발 중 편의를 위해 *로 두고, 배포 시에는 실제 도메인으로 제한할것을 기억!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb+srv://woo15907:Gzoro15907@cluster0.fkjfyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true', 27017)
db = client['econolearn']
users_collection = db['users']

# --- Pydantic 모델 정의 (데이터 형태 선언) ---
# 데이터 유효성 검사를 위해, JSON 변환
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

# --- 기본적인 유저 회원가입 등 관련 API ---

# 회원가입 API
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):  # 들어오는 데이터 : UserRegister 모델
    # user_id 중복 확인(저장된 데이터 베이스에 이미 해당 id가 존재할 경우)
    if users_collection.find_one({'user_id': user.user_id}):
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다")
    
    # 이메일 중복 확인(저장된 데이터 베이스에 이미 해당 이메일이 존재할 경우)
    if users_collection.find_one({'email': user.email}):
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다")
    
    # 유저의 개인정보 보호를 위해 비밀번호 저장을 해시로 암호화하여 개발자도 모르도록 설정
    hashed_password = generate_password_hash(user.password)
    
    # 위의 중복검사 끝난 후 입력받은 Pydantic 모델을 user데이터 베이스에 저장하기 위해 dict화
    user_data = user.dict()
    user_data['password'] = hashed_password
    
    users_collection.insert_one(user_data)
    
    return {"message": "회원가입이 완료되었습니다", "user_id": user.user_id}

# 로그인 API
@app.post("/api/auth/login")
def login(user: UserLogin):
    # 로그인하기 위해 입력받은 id가 현제 관리중인 유저 데이터베이스에 존재하는지 검사
    user_in_db = users_collection.find_one({'user_id': user.user_id})
    if not user_in_db:
        raise HTTPException(status_code=400, detail="존재하지 않는 사용자 ID입니다")
    # 존재할 경우 입력받은 password또한 해시화하여 데이터베이스의 해당아이디의 비밀번호와 같은지 비교
    if not check_password_hash(user_in_db['password'], user.password):
        raise HTTPException(status_code=400, detail="비밀번호가 올바르지 않습니다")
    
    # 로그인 성공 시 필요한 유저 정보 반환
    return {
        "user_id": user_in_db["user_id"],
        "name": user_in_db.get("name", ""),
        "know_level": user_in_db.get("know_level", 0),
        "email": user_in_db.get("email", ""),
        "message": "로그인 성공"
    }
    
# 유저의 프로필 API -> 구현 필요    
@app.post("/api/profile/refresh")
def refresh(user: UserRefresh):
    return 0

# --- 경제 용어 사전 관련 API ---

# 경제 용어 불러오는 API
@app.get("/api/dictionary/terms")
def get_economic_terms():
    # return할 경제 용어들 담을 리스트 사전 선언
    terms = []
    # db의 경제용어들을 돌며 사전 선언한 리스트에 추가함
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

# --- 경제 용어 문제집 관련 API ---

# 현재 서비스에서 제공 가능한 경제 용어 문제집들을 반환하는 API
@app.get('/api/quiz/collections')
def get_quiz_collections():
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

# 퀴즈를 생성하는 API
@app.get('/api/quiz/generate/{collection_id}')
def generate_quiz(collection_id: str):
    try:
        quizzes_collection = db['quizzes']
        
        # 받은 collection_id 값을 '-'기준으로 파싱
        parts = collection_id.split('-')
        
        # 종합 문제집일 경우
        if collection_id == "all-comprehensive":
            # 모든 문제에서 50개 랜덤 선택
            pipeline = [
                {"$sample": {"size": 50}}
            ]
        # 단계 및 카테고리가 지정된 문제집일 경우
        else:
            # 입력 받은 값에서 level의 수치만 필요하기에 replace
            difficulty = int(parts[0].replace('level', ''))
            # 카테고리는 현재 mongoDB에 한국어로 저장되어 있기 때문에 한국어로 변환
            if parts[1] == "economy":
                category = "경제"
            elif parts[1] == "finance":
                category = "금융"
            else:
                category = parts[1]    
            
            # 위 조건들에 따라 필터 조건 생성
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

# 퀴즈 제출 API
@app.post('/api/quiz/submit')
def submit_quiz_results(data: dict):
    try:
        user_id = data.get('user_id') # 현재 로그인 중인 user의 id
        wrong_question_ids = data.get('wrong_question_ids', [])  # 틀린 문제의 _id 리스트
        # 로그인 하지 않을 경우 예외 처리
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        users_collection = db['users']
        
        # 사용자 찾기
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # no_corrects 필드(사용자가 문제를 풂녀서 틀렸던 목록들)가 없으면 생성
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

# 현재 로그인 한 사용자의 틀렸던 문제집 생성 API
@app.get('/api/quiz/review/{user_id}')
def get_review_questions(user_id: str):
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
        
        # ObjectId로 변환(objectid로 현 변환하여 괜찮은지 자동 필터링 하며)
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

# 틀렸던 문제 제출 API
@app.post('/api/quiz/review/submit')
def submit_review_results(data: dict):
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
        
        # 현재 틀린 문제 목록(제출 당시의 DB이기에 제출 전의 상황)
        current_wrong = set(user.get('no_corrects', []))
        
        # 맞은 문제 제거(제출 시 맞은 문제들을 현 DB현황에서 삭제)
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

# 사용자의 ㅟ즈 현 상황 불러오는 API
@app.get('/api/quiz/stats/{user_id}')
def get_user_quiz_stats(user_id: str):
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