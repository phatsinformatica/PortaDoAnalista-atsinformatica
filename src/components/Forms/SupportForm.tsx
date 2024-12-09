import React, { useState, useEffect } from 'react';
import { createSupport, getSupports, updateSupport, deleteSupport, getAnalysts } from '../../services/firestore';
import { Support, Analyst } from '../../types';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function SupportForm() {
  const [supports, setSupports] = useState<Support[]>([]);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [formData, setFormData] = useState<Support>({ name: '', analystId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSupports();
    loadAnalysts();
  }, []);

  const loadSupports = async () => {
    const snapshot = await getSupports();
    const supportsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Support));
    setSupports(supportsList);
  };

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
        await updateSupport(editingId, formData);
      } else {
        await createSupport(formData);
      }
      
      setFormData({ name: '', analystId: '' });
      setEditingId(null);
      await loadSupports();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (support: Support) => {
    setFormData(support);
    setEditingId(support.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este suporte?')) {
      try {
        await deleteSupport(id);
        await loadSupports();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getAnalystName = (analystId: string) => {
    const analyst = analysts.find(a => a.id === analystId);
    return analyst ? analyst.name : 'N/A';
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Analista
            </label>
            <select
              value={formData.analystId}
              onChange={(e) => setFormData({ ...formData, analystId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione um analista</option>
              {analysts.map((analyst) => (
                <option key={analyst.id} value={analyst.id}>
                  {analyst.name}
                </option>
              ))}
            </select>
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
                Analista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supports.map((support) => (
              <tr key={support.id}>
                <td className="px-6 py-4 whitespace-nowrap">{support.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getAnalystName(support.analystId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(support)}
                      className="text-[#70130e] hover:text-[#5e3637]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => support.id && handleDelete(support.id)}
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