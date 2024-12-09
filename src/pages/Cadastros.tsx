import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { AnalystForm } from '../components/Forms/AnalystForm';
import { SupportForm } from '../components/Forms/SupportForm';
import { ReasonForm } from '../components/Forms/ReasonForm';
import { Users, HeadphonesIcon, ListChecks } from 'lucide-react';

type TabType = 'analysts' | 'supports' | 'reasons';

export function Cadastros() {
  const [activeTab, setActiveTab] = useState<TabType>('analysts');

  const tabs = [
    { id: 'analysts', label: 'Analistas', icon: Users },
    { id: 'supports', label: 'Suportes', icon: HeadphonesIcon },
    { id: 'reasons', label: 'Motivos', icon: ListChecks },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16 p-8">
        <h1 className="text-2xl font-bold text-[#5e3637] mb-6">Cadastros</h1>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-[#70130e] text-[#70130e]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'analysts' && <AnalystForm />}
          {activeTab === 'supports' && <SupportForm />}
          {activeTab === 'reasons' && <ReasonForm />}
        </div>
      </main>
    </div>
  );
}