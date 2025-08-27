import React from 'react';

const renderTree = (node) => {
  if (!node) return null;
  return (
    <li>
      <div className="font-semibold text-blue-700 mb-1">{node.name}</div>
      {node.children && node.children.length > 0 && (
        <ul className="ml-6 border-l-2 border-blue-200 pl-4">
          {node.children.map(child => renderTree(child))}
        </ul>
      )}
    </li>
  );
};

const GenealogyTree = ({ tree }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Дерево семьи</h2>
    <ul className="list-none">
      {renderTree(tree)}
    </ul>
  </div>
);

export default GenealogyTree;
