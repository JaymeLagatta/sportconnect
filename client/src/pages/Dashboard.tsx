import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Sport = {
  id: number;
  name: string;
  icon?: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  sportId: number;
};

export default function Dashboard() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Dados simulados - substitua por chamada API real
    setSports([
      { id: 1, name: 'Futebol', icon: '⚽' },
      { id: 2, name: 'Vôlei', icon: '🏐' },
      { id: 3, name: 'Beach Tenis', icon: '🎾' },
      { id: 4, name: 'Corrida', icon: '🏃' },
      { id: 5, name: 'Musculação', icon: '🏋️' },
      { id: 6, name: 'Peteca', icon: '🪶' }
    ]);

    setEvents([
      { id: 1, title: 'Torneio de Beach Tênis', date: '15/10', time: '14:00', sportId: 3 },
      { id: 2, title: 'Aula de Vôlei Iniciante', date: '16/10', time: '09:00', sportId: 2 },
      { id: 3, title: 'Maratona da Cidade', date: '20/10', time: '07:00', sportId: 4 }
    ]);
  }, []);

  const handleSearch = () => {
    if (selectedSport) {
      navigate(`/events?sport=${selectedSport}`);
    }
  };

  const getUserEventsCount = () => {
    // Lógica simulada - substitua pela real
    return 12;
  };

  const getUserScore = () => {
    // Lógica simulada - substitua pela real
    return 1245;
  };

  return (
    <div className="min-h-screen bg-silver-100 font-sans">
      {/* Cabeçalho (igual ao Dashboard) */}
      <header className="bg-primary-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">SportConnect - Dashboard</h1>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/perfil')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
              >
                Perfil
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
                  <span className="bg-secondary-500 px-3 py-1 rounded-full text-sm font-semibold">
                      {user?.user_type || 'Tipo'}
                  </span>
              <div className="text-right">
                 <p className="font-medium">{user?.name}</p>
                 <p className="text-silver-100 text-xs">{user?.email}</p>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto py-8 px-4">
        {/* Seção de Busca */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-600 mb-4">Buscar Esportes</h2>
          <div className="flex space-x-4">
            <select 
              className="flex-1 p-3 border border-silver-500 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              value={selectedSport || ''}
              onChange={(e) => setSelectedSport(Number(e.target.value))}
            >
              <option value="">Selecione um esporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.icon && <span className="mr-2">{sport.icon}</span>}
                  {sport.name}
                </option>
              ))}
            </select>
            <button 
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        </section>

        {/* Seção de Destaques */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Esportes Populares */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Esportes Populares</h3>
            <ul className="space-y-2">
              {sports.slice(0, 3).map((sport) => (
                <li key={sport.id} className="flex justify-between items-center">
                  <span>
                    {sport.icon && <span className="mr-2">{sport.icon}</span>}
                    {sport.name}
                  </span>
                  <span className="text-secondary-500 text-sm font-medium">+10 eventos</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card de Próximos Eventos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border-b border-silver-100 pb-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-silver-500 text-sm">{event.date} - {event.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Sua Atividade</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Eventos participados</span>
              <span className="font-bold">{getUserEventsCount()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pontuação</span>
              <span className="font-bold text-secondary-500">{getUserScore()}</span>
            </div>
          </div>
        </section>

        {/* Seção de Ações Rápidas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Botão Perfil */}
          <button
            onClick={() => navigate('/perfil')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Meu Perfil</h2>
            <p className="text-gray-500 mt-2 text-center">Gerencie suas informações pessoais</p>
          </button>

          {/* Botão Agenda */}
          <button
            onClick={() => navigate('/agenda')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center"
          >
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Minha Agenda</h2>
            <p className="text-gray-500 mt-2 text-center">Visualize seus eventos agendados</p>
          </button>

          {/* Botão Admin (só aparece para administradores) */}
          {user?.user_type === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center"
            >
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Painel Admin</h2>
              <p className="text-gray-500 mt-2 text-center">Acesse ferramentas administrativas</p>
            </button>
          )}
        </section>
      </main>
    </div>
  );
}