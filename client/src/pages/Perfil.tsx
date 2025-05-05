import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
    id: number;
    name: string;
    email: string;
    user_type: string;
    cep?: string;
    sports?: string;
    bio?: string;
    location?: string;
    data_adesao?: string;
};

export default function Perfil() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Substituir pelo ID do usuário logado (pode vir do contexto/auth)
                const userId = 1; // Temporário - buscar do sistema de autenticação

                const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`);

                if (!response.ok) {
                    throw new Error('Erro ao carregar perfil');
                }

                const userData = await response.json();
                setUser({
                    ...userData,
                    // Adiciona campos extras que podem não vir da API
                    location: userData.cep ? `CEP: ${userData.cep}` : 'Não informado',
                    bio: userData.sports ? `Esportes: ${userData.sports}` : 'Nenhum esporte cadastrado'
                });
            } catch (err) {
                console.error('Erro ao buscar usuário:', err);
                setError('Falha ao carregar dados do perfil');
                // Dados mockados para fallback (remover em produção)
                setUser({
                    id: 1,
                    name: 'Usuário Teste',
                    email: 'teste@example.com',
                    user_type: 'mobilizador',
                    bio: 'Dados mockados - API não disponível',
                    location: 'Local não especificado'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-silver-100 font-sans flex items-center justify-center">
                <p>Carregando perfil...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-silver-100 font-sans flex items-center justify-center">
                <p className="text-red-500">{error || 'Perfil não encontrado'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-silver-100 font-sans">
            {/* Cabeçalho */}
            <header className="bg-primary-500 text-white p-4 shadow-lg">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <h1 className="text-2xl font-bold">SportConnect - Meu perfil</h1>

                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/agenda')}
                                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                            >
                                Agenda
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="bg-secondary-500 px-3 py-1 rounded-full text-sm font-semibold">
                                {user.user_type}
                            </span>
                            <div className="text-right">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-silver-100 text-xs">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo do Perfil */}
            <main className="container mx-auto py-8 px-4">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Banner do Perfil */}
                    <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                    {/* Seção de Informações */}
                    <div className="px-6 py-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white -mt-12 bg-silver-200 flex items-center justify-center text-primary-500 text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-silver-500">Membro desde: {user.data_adesao?.split('T')[0]}</p>
                            </div>

                            <button
                                onClick={() => navigate('/editar-perfil')}
                                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition"
                            >
                                Editar Perfil
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-primary-600 mb-2">Informações Pessoais</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Email:</span> {user.email}</p>
                                    <p><span className="font-medium">Localização:</span> {user.location}</p>
                                    <p><span className="font-medium">Tipo de Usuário:</span> {user.user_type}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-primary-600 mb-2">Biografia</h3>
                                <p className="text-silver-800">{user.bio}</p>
                                {user.sports && (
                                    <p className="mt-2">
                                        <span className="font-medium">Esportes:</span> {user.sports}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Seção de Estatísticas */}
                    <div className="px-6 py-4 border-t border-silver-200">
                        <h3 className="text-lg font-semibold text-primary-600 mb-4">Suas Estatísticas</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-silver-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-secondary-500">24</p>
                                <p className="text-silver-600">Eventos</p>
                            </div>
                            <div className="bg-silver-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-secondary-500">1.245</p>
                                <p className="text-silver-600">Pontos</p>
                            </div>
                            <div className="bg-silver-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-secondary-500">12</p>
                                <p className="text-silver-600">Conquistas</p>
                            </div>
                            <div className="bg-silver-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-secondary-500">5</p>
                                <p className="text-silver-600">Esportes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}