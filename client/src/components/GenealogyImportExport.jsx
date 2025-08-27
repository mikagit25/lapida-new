import React, { useRef } from 'react';

export default function GenealogyImportExport({ members, onImport }) {
  const fileInputRef = useRef();

  const handleExport = () => {
    const dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'genealogy.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          onImport(imported);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <button onClick={handleExport}>Экспортировать дерево (JSON)</button>
      <input
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImport}
      />
      <button onClick={() => fileInputRef.current.click()} style={{ marginLeft: 8 }}>
        Импортировать дерево (JSON)
      </button>
    </div>
  );
}
