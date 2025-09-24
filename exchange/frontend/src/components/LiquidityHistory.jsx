import React from 'react';

function LiquidityHistory({ history }) {
  if (!history || history.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">История операций пула ликвидности</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Дата</th>
            <th className="p-2 border">Действие</th>
            <th className="p-2 border">Токен A</th>
            <th className="p-2 border">Токен B</th>
            <th className="p-2 border">TxHash</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td className="p-2 border">{new Date(h.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{h.action === 'add' ? 'Добавление' : 'Удаление'}</td>
              <td className="p-2 border">{h.amountA}</td>
              <td className="p-2 border">{h.amountB}</td>
              <td className="p-2 border"><a href={`https://etherscan.io/tx/${h.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{h.txHash.slice(0, 10)}...</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LiquidityHistory;
