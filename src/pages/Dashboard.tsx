import React from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">
        <h1 className="text-2xl font-bold text-[#5e3637] mb-6">Página Inicial</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add dashboard content here */}
        </div>
      </main>
    </div>
  );
}