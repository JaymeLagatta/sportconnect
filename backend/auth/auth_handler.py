from fastapi import APIRouter, HTTPException, Depends, status, Form
from models.database import get_db_connection
from datetime import datetime, timedelta
import jwt
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from models.schemas import Usuario
import os
from typing import Annotated

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = os.getenv("JWT_SECRET", "segredo_para_desenvolvimento")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def criar_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=dict)
async def login_para_token(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()]
):
    """Autenticação do usuário e geração de token"""
    print("Endpoint /auth/login acessado")  # Isso deve aparecer nos logs do servidor
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, name, email, password, user_type FROM Users WHERE email = ?", 
                    (username,)
                )
                usuario = cursor.fetchone()

                if not usuario or usuario[3] != password:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Email ou senha incorretos",
                        headers={"WWW-Authenticate": "Bearer"}
                    )

                token_data = {
                    "sub": usuario[2], 
                    "id": usuario[0], 
                    "user_type": usuario[4],
                    "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                }
                
                token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
                
                return {
                    "access_token": token, 
                    "token_type": "bearer",
                    "user_id": usuario[0],
                    "user_type": usuario[4]
                }
                
    except Exception as e:
        print(f"Erro no endpoint /auth/login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro durante o login: {str(e)}"
        )
    
@router.get("/me")
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Recupera dados do usuário autenticado"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, name, email, user_type FROM Users WHERE email = ?",
                    (email,)
                )
                user = cursor.fetchone()
                
                if not user:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Usuário não encontrado"
                    )

                return {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                    "user_type": user[3]
                }
                
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )