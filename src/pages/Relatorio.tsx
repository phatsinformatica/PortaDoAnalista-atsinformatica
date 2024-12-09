import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { getTicketsByFilter, getAnalysts, getSupports } from '../services/firestore';
import { Analyst, Support, Ticket } from '../types';
import { exportToExcel } from '../utils/exportToExcel';
import { FileDown, Search } from 'lucide-react';

export function Relatorio() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [supports, setSupports] = useState<Support[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    analystId: '',
    supportId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalysts();
    loadSupports();
  }, []);

  const loadAnalysts = async () => {
    const snapshot = await getAnalysts();
    const analystsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Analyst));
    setAnalysts(analystsList);
  };

  const loadSupports = async () => {
    const snapshot = await getSupports();
    const supportsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Support));
    setSupports(supportsList);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const snapshot = await getTicketsByFilter(
        filters.startDate,
        filters.endDate,
        filters.analystId,
        filters.supportId
      );
      const ticketsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Ticket));
      setTickets(ticketsList);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = tickets.map(ticket => {
      const analyst = analysts.find(a => a.id === ticket.analystId);
      const support = supports.find(s => s.id === ticket.supportId);
      return {
        Data: new Date(ticket.date).toLocaleDateString(),
        Suporte: support?.name || 'N/A',
        Analista: analyst?.name || 'N/A',
        Equipe: analyst?.team || 'N/A',
        Motivo: ticket.reasonId,
        Observação: ticket.observation
      };
    });
    exportToExcel(data, 'relatorio-tickets');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#5e3637]">Relatório</h1>
          {tickets.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-[#70130e] text-white px-4 py-2 rounded-md hover:bg-[#5e3637]"
            >
              <FileDown className="w-4 h-4" />
              Exportar Excel
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analista
              </label>
              <select
                value={filters.analystId}
                onChange={(e) => setFilters({ ...filters, analystId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {analysts.map((analyst) => (
                  <option key={analyst.id} value={analyst.id}>
                    {analyst.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suporte
              </label>
              <select
                value={filters.supportId}
                onChange={(e) => setFilters({ ...filters, supportId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {supports.map((support) => (
                  <option key={support.id} value={support.id}>
                    {support.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-[#70130e] text-white px-4 py-2 rounded-md hover:bg-[#5e3637]"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {tickets.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const analyst = analysts.find(a => a.id === ticket.analystId);
                  const support = supports.find(s => s.id === ticket.supportId);
                  return (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(ticket.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {support?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {analyst?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {analyst?.team || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.reasonId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}