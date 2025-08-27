import GenealogyTreeD3 from './GenealogyTreeD3';
import GenealogyImportExport from './GenealogyImportExport';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FamilyMemberList from './FamilyMemberList';

export default function GenealogyEditor({ treeId, onSaved, template }) {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/users').then(res => setUsers(res.data)).catch(() => {});
    axios.get('/api/memorials').then(res => setMemorials(res.data)).catch(() => {});
    if (treeId) {
      setLoading(true);
      axios.get(`/api/genealogy/${treeId}`)
        .then(res => setMembers(res.data.members || []))
        .catch(() => setMembers([]))
        .finally(() => setLoading(false));
    } else if (template) {
      let initial = [];
      if (template === 'single') {
        initial = [{ name: '', userId: '', memorialId: '' }];
      } else if (template === 'parent_children') {
        initial = [
          { name: '', userId: '', memorialId: '', relation: 'родитель' },
          { name: '', userId: '', memorialId: '', relation: 'ребенок' }
        ];
      } else if (template === 'family') {
        initial = [
          { name: '', userId: '', memorialId: '', relation: 'отец' },
          { name: '', userId: '', memorialId: '', relation: 'мать' },
          { name: '', userId: '', memorialId: '', relation: 'ребенок' }
        ];
      } else if (template === 'three_gen') {
        initial = [
          { name: '', userId: '', memorialId: '', relation: 'бабушка/дедушка' },
          { name: '', userId: '', memorialId: '', relation: 'родитель' },
          { name: '', userId: '', memorialId: '', relation: 'ребенок' }
        ];
      }
      setMembers(initial);
    }
  }, [treeId, template]);

  const handleMemberChange = (idx, newMember) => {
    setMembers(members.map((m, i) => i === idx ? newMember : m));
  };

  const addMember = () => {
    setMembers([...members, { name: '', userId: '', memorialId: '' }]);
  };

  const saveTree = () => {
    setLoading(true);
    setError('');
    const payload = { members };
    const req = treeId
      ? axios.put(`/api/genealogy/${treeId}`, payload)
      : axios.post('/api/genealogy', payload);
    req.then(res => {
      if (onSaved) onSaved(res.data);
    }).catch(() => setError('Ошибка сохранения')).finally(() => setLoading(false));
  };

  return (
    <div>
      <h3>Редактировать генеалогическое дерево</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
  <GenealogyImportExport members={members} onImport={setMembers} />
  <GenealogyTreeD3 members={members} />
      <FamilyMemberList
        members={members}
        onMemberChange={handleMemberChange}
        users={users}
        memorials={memorials}
      />
      <button onClick={addMember} disabled={loading}>Добавить члена семьи</button>
      <button onClick={saveTree} disabled={loading}>Сохранить дерево</button>
    </div>
  );
}
