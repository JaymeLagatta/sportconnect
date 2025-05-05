import os
import pyodbc
from dotenv import load_dotenv
from pathlib import Path
from fastapi import HTTPException, status

# Configuração do caminho do .env - mais robusta
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)

def get_db_connection():
    """
    Estabelece conexão com o banco de dados SQL Server
    Retorna:
        pyodbc.Connection: Objeto de conexão com o banco
    Levanta:
        HTTPException: Em caso de falha na conexão
    """
    try:
        # String de conexão formatada de forma mais legível
        connection_string = (
            f"DRIVER={os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')};"
            f"SERVER={os.getenv('DB_SERVER', 'localhost\\SQLEXPRESS')};"
            f"DATABASE={os.getenv('DB_NAME', 'SportConnect')};"
            f"Trusted_Connection={os.getenv('DB_TRUSTED_CONNECTION', 'yes')};"
        )
        
        conn = pyodbc.connect(connection_string)
        return conn
        
    except pyodbc.InterfaceError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Erro de interface com o banco: {str(e)}"
        )
    except pyodbc.OperationalError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro operacional no banco: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro inesperado ao conectar ao banco: {str(e)}"
        )

def test_db_connection():
    """
    Testa a conexão com o banco de dados
    Retorna:
        bool: True se a conexão foi bem-sucedida, False caso contrário
    """
    try:
        conn = get_db_connection()
        if conn:
            conn.close()
            return True
        return False
    except:
        return False