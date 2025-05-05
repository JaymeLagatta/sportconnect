import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
    const { user } = useAuth();

    // Adicione um loading state se necessário
    if (user === null) {
        return <div>Carregando...</div>; // Ou algum componente de loading
    }

    return user?.user_type === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
}