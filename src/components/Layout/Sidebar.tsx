import React from 'react';
import { Home, UserPlus, Ticket, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Página Inicial', path: '/dashboard' },
  { icon: UserPlus, label: 'Cadastros', path: '/cadastros' },
  { icon: Ticket, label: 'Tickets', path: '/tickets' },
  { icon: BarChart3, label: 'Relatório', path: '/relatorio' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen fixed left-0 top-16">
      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              location.pathname === item.path
                ? 'bg-[#70130e] text-white'
                : 'text-[#5e3637] hover:bg-gray-50'
            } rounded-lg mb-2`}
          >
            <item.icon className={`w-5 h-5 ${
              location.pathname === item.path ? 'text-white' : 'text-[#cc9c9c]'
            }`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}