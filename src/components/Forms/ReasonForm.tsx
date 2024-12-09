import React, { useState, useEffect } from 'react';
import { createReason, getReasons, updateReason, deleteReason } from '../../services/firestore';
import { Reason } from '../../types';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function ReasonForm() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [formData, setFormData] = useState<Reason>({ description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReasons();
  }, []);

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
        await updateReason(editingId, formData);
      } else {
        await createReason(formData);
      }
      
      setFormData({ description: '' });
      setEditingId(null);
      await loadReasons();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reason: Reason) => {
    setFormData(reason);
    setEditingId(reason.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este motivo?')) {
      try {
        await deleteReason(id);
        await loadReasons();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
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
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reasons.map((reason) => (
              <tr key={reason.id}>
                <td className="px-6 py-4 whitespace-nowrap">{reason.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reason)}
                      className="text-[#70130e] hover:text-[#5e3637]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => reason.id && handleDelete(reason.id)}
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