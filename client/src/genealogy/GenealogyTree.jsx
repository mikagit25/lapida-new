import React from 'react';

const renderTree = (node) => {
  if (!node) return null;
  return (
    <li>
      <strong>{node.name}</strong> ({node.relation})
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => renderTree(child))}
        </ul>
      )}
    </li>
  );
};

const GenealogyTree = ({ treeData }) => (
  <div>
    <h3>Родословное дерево</h3>
    <ul>
      {renderTree(treeData)}
    </ul>
  </div>
);

export default GenealogyTree;
