import React, { useState, useEffect } from 'react';
import { createAnalyst, getAnalysts, updateAnalyst, deleteAnalyst } from '../../services/firestore';
import { Analyst } from '../../types';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function AnalystForm() {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [formData, setFormData] = useState<Analyst>({ name: '', email: '', team: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalysts();
  }, []);

  const loadAnalysts = async () => {
    const snapshot = await getAnalysts();
    const analystsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Analyst));
    setAnalysts(analystsList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateAnalyst(editingId, formData);
      } else {
        await createAnalyst(formData);
      }
      
      setFormData({ name: '', email: '', team: '' });
      setEditingId(null);
      await loadAnalysts();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (analyst: Analyst) => {
    setFormData(analyst);
    setEditingId(analyst.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este analista?')) {
      try {
        await deleteAnalyst(id);
        await loadAnalysts();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipe
            </label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
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

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analysts.map((analyst) => (
              <tr key={analyst.id}>
                <td className="px-6 py-4 whitespace-nowrap">{analyst.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{analyst.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{analyst.team}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(analyst)}
                      className="text-[#70130e] hover:text-[#5e3637]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => analyst.id && handleDelete(analyst.id)}
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
    </div>
  );
}