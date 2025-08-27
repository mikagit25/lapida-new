import React from 'react';
import MemoryDaysCalendar from '../components/MemoryDaysCalendar';

const MemoryDays = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Дни памяти</h1>
      <MemoryDaysCalendar />
    </div>
  );
};

export default MemoryDays;
