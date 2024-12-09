import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-[#70130e] text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <img 
          src="https://www.atsinformatica.com.br/wp-content/uploads/2024/06/logo-ats-branca.svg" 
          alt="ATS Informática" 
          className="h-8"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Bem-vindo(a), {user?.email}</span>
        <button 
          onClick={handleSignOut}
          className="text-sm hover:text-gray-200"
        >
          Sair
        </button>
      </div>
    </header>
  );
}