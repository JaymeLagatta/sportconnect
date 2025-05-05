from models.database import get_db_connection
from fastapi import HTTPException, status
from models.schemas import UsuarioCreate, Usuario, UsuarioResponse
from datetime import datetime
import logging
import pyodbc

logger = logging.getLogger(__name__)

async def listar_usuarios_service() -> list[Usuario]:
    """Lista todos os usuários cadastrados"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id, name, email, cep, user_type, sports, data_adesao 
                    FROM Users
                """)
                
                columns = [column[0] for column in cursor.description]
                usuarios = []
                
                for row in cursor.fetchall():
                    usuario_dict = dict(zip(columns, row))
                    usuarios.append(Usuario(
                        id=usuario_dict['id'],
                        name=usuario_dict['name'],
                        email=usuario_dict['email'],
                        cep=usuario_dict['cep'],
                        user_type=usuario_dict['user_type'],
                        sports=usuario_dict.get('sports'),
                        data_adesao=usuario_dict['data_adesao']
                    ))
                
                return usuarios
                
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao recuperar usuários do banco de dados"
        )

async def criar_usuario_service(usuario: UsuarioCreate) -> UsuarioResponse:
    """Cria um novo usuário no sistema com tratamento robusto"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Normaliza dados
                sports = usuario.sports if usuario.sports else None
                email = usuario.email.lower().strip()
                
                logger.debug(f"Tentando cadastrar email: {email}")

                try:
                    cursor.execute(
                        """INSERT INTO Users (
                            name, email, cep, password, user_type, sports, data_adesao
                        ) 
                        OUTPUT 
                            INSERTED.id, 
                            INSERTED.name, 
                            INSERTED.email,
                            INSERTED.cep,
                            INSERTED.user_type,
                            INSERTED.sports,
                            INSERTED.data_adesao
                        VALUES (?, ?, ?, ?, ?, ?, ?)""",
                        (
                            usuario.name.strip(),
                            email,
                            usuario.cep,
                            usuario.password,
                            usuario.user_type.value,
                            sports,
                            datetime.utcnow()
                        )
                    )
                    
                    result = cursor.fetchone()
                    conn.commit()
                    
                    if not result:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Falha ao recuperar usuário criado"
                        )
                    
                    columns = [column[0] for column in cursor.description]
                    usuario_dict = dict(zip(columns, result))
                    
                    # Converte datetime para string ISO
                    usuario_dict['data_adesao'] = usuario_dict['data_adesao'].isoformat()
                    
                    # Remove a senha do response
                    usuario_dict.pop('password', None)
                    
                    return UsuarioResponse(**usuario_dict)
                    
                except pyodbc.IntegrityError as e:
                    if "2627" in str(e) or "duplicate" in str(e).lower():
                        logger.warning(f"Email duplicado: {email}")
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email já cadastrado no sistema"
                        )
                    raise
                    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar cadastro: {str(e)}"
        )