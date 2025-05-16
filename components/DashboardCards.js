export default function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-50 p-6 rounded-lg shadow flex flex-col items-start">
        <span className="text-blue-600 font-bold text-2xl">{stats?.ativos ?? '--'}</span>
        <span className="text-gray-700 mt-2">Checklists Ativos</span>
      </div>
      <div className="bg-yellow-50 p-6 rounded-lg shadow flex flex-col items-start">
        <span className="text-yellow-600 font-bold text-2xl">{stats?.pendentes ?? '--'}</span>
        <span className="text-gray-700 mt-2">Pendentes</span>
      </div>
      <div className="bg-green-50 p-6 rounded-lg shadow flex flex-col items-start">
        <span className="text-green-600 font-bold text-2xl">{stats?.concluidos ?? '--'}</span>
        <span className="text-gray-700 mt-2">Concluídos</span>
      </div>
    </div>
  );
}
