import React from 'react';
import Tree from 'react-d3-tree';

function convertToD3Format(members) {
  if (!members || members.length === 0) return null;
  // Преобразуем flat-массив в дерево (основатель — первый элемент)
  const root = {
    name: members[0].name || 'Основатель',
    attributes: { relation: members[0].relation },
    children: []
  };
  // Пример: все остальные — дети основателя
  for (let i = 1; i < members.length; i++) {
    root.children.push({
      name: members[i].name || 'Член семьи',
      attributes: { relation: members[i].relation },
      children: []
    });
  }
  return root;
}

export default function GenealogyTreeD3({ members }) {
  const treeData = convertToD3Format(members);
  if (!treeData) return <div>Нет данных для визуализации.</div>;
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Tree data={treeData} orientation="vertical" />
    </div>
  );
}
