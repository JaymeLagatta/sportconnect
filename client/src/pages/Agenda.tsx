import { useNavigate } from 'react-router-dom';

export default function Agenda() {
  const navigate = useNavigate();
  
  // Eventos simulados
  const events = [
    { id: 1, title: 'Torneio de Beach Tênis', date: '15/10/2023', time: '14:00', location: 'Praia do Leblon' },
    { id: 2, title: 'Aula de Vôlei Iniciante', date: '16/10/2023', time: '09:00', location: 'Ginásio Municipal' },
    { id: 3, title: 'Corrida Noturna 5K', date: '18/10/2023', time: '19:30', location: 'Parque do Ibirapuera' },
    { id: 4, title: 'Treino Funcional', date: '20/10/2023', time: '07:00', location: 'Praça das Artes' }
  ];

  return (
    <div className="min-h-screen bg-silver-100 font-sans">
      {/* Cabeçalho (igual ao Dashboard) */}
      <header className="bg-primary-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">SportConnect - Minha Agenda</h1>
          
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
                Mobilizador
              </span>
              <div className="text-right">
                <p className="font-medium">Jay Lagatta</p>
                <p className="text-silver-100 text-xs">jay@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo da Agenda */}
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cabeçalho da Agenda */}
          <div className="px-6 py-4 border-b border-silver-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary-600">Próximos Eventos</h2>
            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm">
              Adicionar Evento
            </button>
          </div>
          
          {/* Lista de Eventos */}
          <div className="divide-y divide-silver-200">
            {events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-silver-50 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-silver-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {event.date}
                      </span>
                      <span className="flex items-center text-silver-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {event.time}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-silver-100 hover:bg-silver-200 rounded-lg text-sm font-medium transition">
                      Detalhes
                    </button>
                    <button className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg text-sm font-medium transition">
                      Participar
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-silver-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {event.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}