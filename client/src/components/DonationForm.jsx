import React, { useState } from 'react';

const DonationForm = ({ onDonate }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (value > 0) {
      onDonate(value);
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="number"
        min="1"
        step="1"
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Сумма доната (₽)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Задонатить</button>
    </form>
  );
};

export default DonationForm;
