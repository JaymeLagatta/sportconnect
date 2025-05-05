import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  
  // Dados simulados para o admin
  const stats = [
    { title: 'Usuários Registrados', value: '1.245', change: '+12%' },
    { title: 'Eventos Criados', value: '328', change: '+5%' },
    { title: 'Novos Mobilizadores', value: '24', change: '+8%' },
    { title: 'Taxa de Engajamento', value: '78%', change: '+3%' }
  ];

  const recentActivities = [
    { user: 'Ana Silva', action: 'criou um novo evento', time: 'há 15 minutos' },
    { user: 'Carlos Oliveira', action: 'se registrou como mobilizador', time: 'há 32 minutos' },
    { user: 'Mariana Costa', action: 'organizou 3 eventos', time: 'há 1 hora' },
    { user: 'Pedro Santos', action: 'atingiu 1000 pontos', time: 'há 2 horas' }
  ];

  return (
    <div className="min-h-screen bg-silver-100 font-sans">
      {/* Cabeçalho (igual ao Dashboard) */}
      <header className="bg-primary-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">SportConnect - Painel Admin</h1>
          
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
              <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">
                Admin
              </span>
              <div className="text-right">
                <p className="font-medium">Jay Lagatta</p>
                <p className="text-silver-100 text-xs">jay@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo do Admin */}
      <main className="container mx-auto py-8 px-4">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-silver-500 text-sm font-medium">{stat.title}</h3>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Seções do Painel Admin */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Usuários */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary-600">Gerenciamento de Usuários</h2>
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm">
                Adicionar Usuário
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-silver-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-silver-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-silver-200 flex items-center justify-center text-primary-500 font-bold">
                            {item}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-silver-900">Usuário {item}</div>
                            <div className="text-sm text-silver-500">user{item}@exemplo.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-silver-100 text-silver-800">
                          {item % 2 === 0 ? 'Mobilizador' : 'Participante'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-silver-500">
                        <button className="text-primary-500 hover:text-primary-600 mr-3">Editar</button>
                        <button className="text-red-500 hover:text-red-600">Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-primary-600 mb-6">Atividades Recentes</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-b border-silver-100 pb-4 last:border-0">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-silver-600">{activity.action}</p>
                  <p className="text-silver-400 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}