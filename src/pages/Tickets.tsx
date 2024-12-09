import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { createTicket, getTickets, updateTicket, deleteTicket, getSupports, getReasons } from '../services/firestore';
import { Ticket, Support, Reason } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [supports, setSupports] = useState<Support[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [formData, setFormData] = useState<Ticket>({
    supportId: '',
    reasonId: '',
    analystId: user?.uid || '',
    observation: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTickets();
    loadSupports();
    loadReasons();
  }, []);

  const loadTickets = async () => {
    const snapshot = await getTickets();
    const ticketsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ticket));
    setTickets(ticketsList);
  };

  const loadSupports = async () => {
    const snapshot = await getSupports();
    const supportsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Support));
    setSupports(supportsList);
  };

  const loadReasons = async () => {
    const snapshot = await getReasons();
    const reasonsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reason));
    setReasons(reasonsList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateTicket(editingId, formData);
      } else {
        await createTicket(formData);
      }
      
      setFormData({
        supportId: '',
        reasonId: '',
        analystId: user?.uid || '',
        observation: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      await loadTickets();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setFormData(ticket);
    setEditingId(ticket.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ticket?')) {
      try {
        await deleteTicket(id);
        await loadTickets();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getSupportName = (supportId: string) => {
    const support = supports.find(s => s.id === supportId);
    return support ? support.name : 'N/A';
  };

  const getReasonDescription = (reasonId: string) => {
    const reason = reasons.find(r => r.id === reasonId);
    return reason ? reason.description : 'N/A';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">
        <h1 className="text-2xl font-bold text-[#5e3637] mb-6">Tickets</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suporte
              </label>
              <select
                value={formData.supportId}
                onChange={(e) => setFormData({ ...formData, supportId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um suporte</option>
                {supports.map((support) => (
                  <option key={support.id} value={support.id}>
                    {support.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo
              </label>
              <select
                value={formData.reasonId}
                onChange={(e) => setFormData({ ...formData, reasonId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um motivo</option>
                {reasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observação
              </label>
              <textarea
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#70130e] text-white px-4 py-2 rounded-md hover:bg-[#5e3637]"
            >
              <Plus className="w-4 h-4" />
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>

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
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSupportName(ticket.supportId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getReasonDescription(ticket.reasonId)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{ticket.observation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ticket)}
                        className="text-[#70130e] hover:text-[#5e3637]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => ticket.id && handleDelete(ticket.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}