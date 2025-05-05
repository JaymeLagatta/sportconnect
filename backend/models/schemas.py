from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    MOBILIZADOR = "mobilizador"
    ATLETA = "atleta"
    ORGANIZADOR = "organizador"
    ADMIN = "admin"
    EMBAIXADOR = "embaixador"

class UsuarioBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    user_type: UserType

class UsuarioCreate(UsuarioBase):
    cep: str = Field(..., pattern=r'^\d{5}-?\d{3}$')  # Aceita com ou sem hífen
    password: str = Field(..., min_length=6, max_length=255)
    sports: Optional[str] = Field(None, max_length=255)

    @field_validator('password')
    def password_complexity(cls, v):
        if len(v) < 6:
            raise ValueError('A senha deve ter pelo menos 6 caracteres')
        return v

class Usuario(UsuarioBase):
    id: int
    cep: str
    data_adesao: datetime
    sports: Optional[str] = None
    
    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    cep: Optional[str] = Field(None, pattern=r'^\d{5}-?\d{3}$')
    sports: Optional[str] = Field(None, max_length=255)
    
class UsuarioResponse(UsuarioBase):  # Alterado: Não herda mais de UsuarioCreate
    id: int
    cep: str
    data_adesao: str  # Garantido como string
    sports: Optional[str] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Conversão explícita para string
        }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str