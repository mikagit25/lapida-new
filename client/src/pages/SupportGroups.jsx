import React from 'react';
import SupportGroupList from '../components/SupportGroupList';

const SupportGroups = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Группы поддержки</h1>
      <SupportGroupList />
    </div>
  );
};

export default SupportGroups;
