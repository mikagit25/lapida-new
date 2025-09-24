import React, { useState } from 'react';

const proposalsMock = [
  { id: 1, title: 'Добавить новый пул', votesFor: 12, votesAgainst: 3 },
  { id: 2, title: 'Изменить APR на 12%', votesFor: 8, votesAgainst: 5 }
];

function DaoVoting() {
  const [proposals, setProposals] = useState(proposalsMock);
  const [txStatus, setTxStatus] = useState('');

  // TODO: web3 голосование

  const handleVote = async (id, vote) => {
    setTxStatus('Голосование...');
    // TODO: web3 vote call
    setTxStatus('Голос учтен!');
    setProposals(proposals.map(p => p.id === id ? { ...p, [vote === 'for' ? 'votesFor' : 'votesAgainst']: p[vote === 'for' ? 'votesFor' : 'votesAgainst'] + 1 } : p));
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">DAO / Голосование</h2>
      {proposals.map(p => (
        <div key={p.id} className="mb-4 p-2 border rounded">
          <div className="font-semibold">{p.title}</div>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleVote(p.id, 'for')}>За ({p.votesFor})</button>
            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleVote(p.id, 'against')}>Против ({p.votesAgainst})</button>
          </div>
        </div>
      ))}
      {txStatus && <div className="mt-2 text-sm text-gray-700">{txStatus}</div>}
    </div>
  );
}

export default DaoVoting;
