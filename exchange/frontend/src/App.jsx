import React, { useState } from 'react';
import Exchange from './components/Exchange';
import UserDashboard from './components/UserDashboard';
import DaoVoting from './components/DaoVoting';
import WhitepaperPage from './components/WhitepaperPage';
import TokenomicsPage from './components/TokenomicsPage';
import TeamPage from './components/TeamPage';
import FaqPage from './components/FaqPage';
import SupportPage from './components/SupportPage';

function App() {
  const [view, setView] = useState('exchange');
  const [provider, setProvider] = useState(null);

  // Передача provider из Exchange при подключении кошелька
  const handleProvider = (prov) => setProvider(prov);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-center text-xl font-bold">Lapida Exchange</header>
      <nav className="flex flex-wrap justify-center gap-2 mb-4">
        <button className={`px-4 py-2 rounded ${view === 'exchange' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('exchange')}>Обмен</button>
        <button className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('dashboard')}>Дашборд</button>
        <button className={`px-4 py-2 rounded ${view === 'dao' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('dao')}>DAO / Голосование</button>
        <button className={`px-4 py-2 rounded ${view === 'whitepaper' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('whitepaper')}>Whitepaper</button>
        <button className={`px-4 py-2 rounded ${view === 'tokenomics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('tokenomics')}>Токеномика</button>
        <button className={`px-4 py-2 rounded ${view === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('team')}>Команда</button>
        <button className={`px-4 py-2 rounded ${view === 'faq' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('faq')}>FAQ</button>
        <button className={`px-4 py-2 rounded ${view === 'support' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setView('support')}>Поддержка</button>
      </nav>
      <main className="flex justify-center items-center">
        {view === 'exchange' && <Exchange onProvider={handleProvider} />}
        {view === 'dashboard' && <UserDashboard provider={provider} />}
        {view === 'dao' && <DaoVoting />}
        {view === 'whitepaper' && <WhitepaperPage />}
        {view === 'tokenomics' && <TokenomicsPage />}
        {view === 'team' && <TeamPage />}
        {view === 'faq' && <FaqPage />}
        {view === 'support' && <SupportPage />}
      </main>
    </div>
  );
}

export default App;
