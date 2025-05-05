from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List, Annotated
from datetime import datetime
import logging
from services.usuarios_service import criar_usuario_service
from models.schemas import UsuarioCreate, UsuarioResponse, Usuario  # Adicionei o Response

# Importações ABSOLUTAS (ajuste conforme sua estrutura)
from models.schemas import Usuario, UsuarioCreate
from services.usuarios_service import (
    listar_usuarios_service,
    criar_usuario_service
)

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"],
    responses={404: {"description": "Não encontrado"}}
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """Verificação básica de token - implemente sua lógica real aqui"""
    # Exemplo simplificado:
    try:
        # Valide o token JWT aqui
        return {"username": "admin"}  # Dummy data
    except Exception as e:
        logger.error(f"Erro na autenticação: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )

@router.get(
    "/",
    response_model=List[Usuario],
    summary="Lista todos os usuários",
    responses={
        200: {"description": "Lista de usuários retornada com sucesso"},
        401: {"description": "Não autorizado"},
        500: {"description": "Erro interno do servidor"}
    }
)
async def listar_usuarios(
    current_user: Annotated[dict, Depends(get_current_user)]
):
    try:
        logger.info(f"Listagem solicitada por: {current_user.get('username')}")
        usuarios = await listar_usuarios_service()
        return usuarios
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao recuperar usuários"
        )

@router.post(
    "/",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário",
    responses={
        201: {"description": "Usuário criado com sucesso"},
        400: {"description": "Dados inválidos ou usuário já existe"},
        422: {"description": "Erro de validação"},
        500: {"description": "Erro interno"}
    }
)

async def criar_usuario(usuario_data: dict):  # Alterado para receber dict diretamente
    """
    Endpoint para criação de usuários com:
    - Validação adicional
    - Logging detalhado
    - Tratamento de erros específico
    """
    try:
        logger.info(f"Tentativa de cadastro para: {usuario_data.get('email')}")
        
        # Validação do CEP
        cep = usuario_data.get('cep', '').replace('-', '')
        if len(cep) != 8 or not cep.isdigit():
            raise ValueError("CEP inválido. Deve conter 8 dígitos.")
        
        # Formata o CEP com hífen
        usuario_data['cep'] = f"{cep[:5]}-{cep[5:]}"
        
        # Converte para UsuarioCreate para validação
        usuario = UsuarioCreate(**usuario_data)
        
        # Chamada ao serviço
        novo_usuario = await criar_usuario_service(usuario)
        
        logger.info(f"Novo usuário criado - ID: {novo_usuario.id}")
        return UsuarioResponse(**novo_usuario.model_dump())
        
    except ValueError as ve:
        logger.warning(f"Validação falhou: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar cadastro: {str(e)}")
