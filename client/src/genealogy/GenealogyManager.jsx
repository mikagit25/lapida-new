
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import GenealogyTree from './GenealogyTree';
import GenealogyEditor from '../components/GenealogyEditor';
import ReactModal from 'react-modal';
import TemplateSelector from '../components/TemplateSelector';

const GenealogyManager = () => {
  const [tree, setTree] = useState(null);
  const [treeId, setTreeId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: 'основатель', userId: '', memorialId: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [selectTemplate, setSelectTemplate] = useState(false);
  const [template, setTemplate] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/genealogy`)
      .then(res => res.json())
      .then(data => {
        if (data && data.members) {
          setTree(data);
          setTreeId(data._id);
        }
      });
  }, []);

  const handleSaved = (savedTree) => {
    setTree(savedTree);
    setTreeId(savedTree._id);
    setEditing(false);
  };

  return (
    <div>
      <h2>Генеалогия</h2>
      {tree && tree.members && tree.members.length > 0 ? (
        <>
          <GenealogyTree treeData={tree.members[0]} />
          <button onClick={() => setEditing(true)}>Редактировать дерево</button>
          {editing && (
            <GenealogyEditor treeId={treeId} onSaved={handleSaved} />
          )}
        </>
      ) : (
        <>
          <button onClick={() => setSelectTemplate(true)}>Создать дерево</button>
          {selectTemplate && (
            <TemplateSelector onSelect={key => {
              setTemplate(key);
              setEditing(true);
              setSelectTemplate(false);
            }} />
          )}
          <ReactModal
            isOpen={showCreateModal}
            onRequestClose={() => setShowCreateModal(false)}
            ariaHideApp={false}
            style={{ content: { maxWidth: 400, margin: 'auto' } }}
          >
            <h3>Создать генеалогическое дерево</h3>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Имя основателя"
                value={newMember.name}
                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                style={{ width: '100%', marginBottom: 8 }}
              />
              <input
                type="text"
                placeholder="Связь (например, основатель)"
                value={newMember.relation}
                onChange={e => setNewMember({ ...newMember, relation: e.target.value })}
                style={{ width: '100%', marginBottom: 8 }}
              />
              {/* Привязка к пользователю и мемориалу — опционально, можно добавить позже */}
            </div>
            {createError && <div style={{ color: 'red' }}>{createError}</div>}
            <button
              onClick={async () => {
                setCreating(true);
                setCreateError('');
                try {
                  const res = await fetch(`${API_BASE_URL}/genealogy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ members: [newMember] })
                  });
                  const data = await res.json();
                  if (data && data._id) {
                    setTree(data);
                    setTreeId(data._id);
                    setShowCreateModal(false);
                  } else {
                    setCreateError('Ошибка создания');
                  }
                } catch {
                  setCreateError('Ошибка создания');
                }
                setCreating(false);
              }}
              disabled={creating || !newMember.name}
            >Создать</button>
            <button onClick={() => setShowCreateModal(false)} style={{ marginLeft: 8 }}>Отмена</button>
          </ReactModal>
        </>
      )}
      {editing && (
        <GenealogyEditor treeId={treeId} onSaved={handleSaved} template={template} />
      )}
    </div>
  );
};

export default GenealogyManager;
