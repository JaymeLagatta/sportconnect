from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.usuarios import router as usuarios_router  # Remova o outro import
from auth.auth_handler import router as auth_router


app = FastAPI(
    title="SportConnect API",
    description="API para o sistema SportConnect",
    version="1.0.0"
)
# Adicione isso ANTES de incluir os routers
@app.get("/")
async def root():
    return {"message": "API Online"}

# Importante: inclua o router corretamente
app.include_router(auth_router)

# Adicione para debug (opcional)
print("Rotas registradas:")
for route in app.routes:
    print(f"{route.path} -> {route.methods}")

# CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(
    usuarios_router,
    prefix="/api",  # Prefixo geral da API
    tags=["Usuários"]
)

app.include_router(
    auth_router,
    prefix="/api/auth",  # Prefixo aninhado
    tags=["Autenticação"]
)

@app.get("/api/health")  # Padronize com /api
def health_check():
    from models.database import test_db_connection
    return {"status": "healthy", "database": "connected" if test_db_connection() else "disconnected"}