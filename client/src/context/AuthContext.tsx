import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    email: string;
    user_type: string;
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Inicia como true para verificação inicial
    const navigate = useNavigate();

    // Verifica token ao carregar
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userResponse = await fetch('http://localhost:5000/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Token verification error:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (token: string) => {
        setLoading(true);
        try {
            // Primeiro verifica o token
            const userResponse = await fetch('http://localhost:5000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Falha na autenticação');
            }

            const userData = await userResponse.json();

            localStorage.setItem('token', token);
            setUser(userData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!user,
            user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};