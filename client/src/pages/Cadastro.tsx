import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        cep: '',
        password: '',
        user_type: 'mobilizador',
        sports: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        // Validação básica dos campos
        if (!form.name.trim() || !form.email.trim() || !form.password || !form.cep.trim()) {
            setError('Preencha todos os campos obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        // Validação de email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Por favor, insira um email válido.');
            setIsSubmitting(false);
            return;
        }

        // Validação de CEP (8 dígitos)
        const cepNumerico = form.cep.replace(/\D/g, '');
        if (cepNumerico.length !== 8) {
            setError('CEP deve conter 8 dígitos.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepara o payload com tratamento especial para campos vazios
            const payload = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(), // Normaliza email
                cep: cepNumerico,
                password: form.password,
                user_type: form.user_type,
                sports: form.sports.trim() || undefined // Converte string vazia para undefined
            };

            console.log('Enviando payload:', payload); // Debug

            const response = await fetch('http://localhost:5000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include' // Importante para sessões/cookies
            });

            // Tratamento detalhado da resposta
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('Erro detalhado do servidor:', errorData);
                } catch (parseError) {
                    console.error('Erro ao parsear resposta:', parseError);
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                const errorMsg = errorData.detail ||
                    errorData.message ||
                    'Erro ao processar cadastro';
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log('Cadastro bem-sucedido:', data);

            setSuccess('Cadastro realizado! Redirecionando...');
            setTimeout(() => navigate('/login'), 1500);

        } catch (err: any) {
            console.error('Erro completo:', err);

            // Tratamento específico para erros de conexão
            if (err.message.includes('Failed to fetch')) {
                setError('Erro de conexão com o servidor. Verifique sua rede.');
            }
            // Tratamento para erros do ODBC/SQL
            else if (err.message.includes('HY010') || err.message.includes('ODBC')) {
                setError('Erro temporário no banco de dados. Tente novamente.');
            }
            else {
                setError(err.message || 'Erro inesperado. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-silver-100 font-sans flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-primary-600">Criar nova conta</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {typeof error === 'string' ? error : 'Erro desconhecido'}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        type="text"
                        placeholder="Nome completo"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />

                    <input
                        name="cep"
                        type="text"
                        placeholder="CEP"
                        value={form.cep}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        minLength={6}
                    />

                    <select
                        name="user_type"
                        value={form.user_type}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    >
                        <option value="mobilizador">Mobilizador</option>
                        <option value="atleta">Atleta</option>
                        <option value="organizador">Organizador</option>
                    </select>

                    <input
                        name="sports"
                        type="text"
                        placeholder="Esportes (separados por vírgula)"
                        value={form.sports}
                        onChange={handleChange}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        className={`w-full bg-primary-500 text-white py-3 rounded font-semibold transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}