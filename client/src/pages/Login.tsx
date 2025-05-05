import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface LoginResponse {
    access_token: string;
    token_type: string;
    detail?: string;
}

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.email.trim()) {
            setError('Por favor, informe seu email');
            return;
        }

        if (!form.password) {
            setError('Por favor, informe sua senha');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Por favor, insira um email válido');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', form.email);
            formData.append('password', form.password);

            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: form.email,
                    password: form.password
                }).toString()
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                const errorMsg = data.detail ||
                    (response.status === 401 ? 'Email ou senha incorretos' :
                        `Erro no servidor (${response.status})`);
                throw new Error(errorMsg);
            }

            if (!data.access_token) {
                throw new Error('Token de acesso não recebido');
            }

            await login(data.access_token);
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Erro no login:', error);
            setError(error.message || 'Erro durante o login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToCadastro = () => {
        navigate('/cadastro');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                <div className="bg-silver-800 text-white p-6 text-center">
                    <h1 className="text-3xl font-bold">SportConnect</h1>
                    <p className="text-silver-300">Conecte-se ao mundo esportivo</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-silver-800 font-medium mb-2">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                            placeholder="seu@email.com"
                            required
                            autoComplete="username"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-silver-800 font-medium mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-silver-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        aria-label={isLoading ? "Processando..." : "Entrar na plataforma"}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                            </span>
                        ) : "Entrar"}
                    </button>

                    <div className="text-center pt-4 border-t border-silver-100">
                        <button
                            type="button"
                            onClick={handleNavigateToCadastro}
                            className="text-secondary-500 hover:text-secondary-600 text-sm font-medium"
                            disabled={isLoading}
                            aria-label="Criar nova conta"
                        >
                            Criar nova conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}