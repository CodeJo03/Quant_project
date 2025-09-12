from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

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
# 이 모델 하나로 데이터 유효성 검사, JSON 변환이 모두 끝납니다.
class UserRegister(BaseModel):
    user_id: str
    password: str
    name: str
    age: int
    email: EmailStr  # 이메일 형식 자동 검증
    know_level: int

class UserLogin(BaseModel):
    user_id: str
    password: str

# --- API 라우트 정의 ---
# 현재 db연동이 안되어 상호작용 안되는 것이니 백과는 상호작용 완료
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):  # 들어오는 데이터를 UserRegister 모델로 받음
    # user_id 중복 확인
    if users_collection.find_one({'user_id': user.user_id}):
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다")
    
    # 이메일 중복 확인
    if users_collection.find_one({'email': user.email}):
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다")

    # FastAPI가 자동으로 user.user_id, user.password 등을 검증해주므로
    # 수동으로 필드를 확인할 필요가 없습니다.

    hashed_password = generate_password_hash(user.password)
    
    # user.dict()를 통해 Pydantic 모델을 딕셔너리로 변환
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