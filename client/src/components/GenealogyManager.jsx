import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiFetch';
import GenealogyTree from './GenealogyTree';

const GenealogyManager = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/genealogy');
      const data = await res.json();
      setTreeData(data.tree || null);
      setError('');
    } catch (e) {
      setError('Ошибка загрузки генеалогии');
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Генеалогия</h1>
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {treeData ? <GenealogyTree tree={treeData} /> : <div>Нет данных для отображения.</div>}
    </div>
  );
};

export default GenealogyManager;
