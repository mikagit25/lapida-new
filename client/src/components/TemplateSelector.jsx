import React from 'react';

const templates = [
  { key: 'single', label: 'Одиночка (один основатель)' },
  { key: 'parent_children', label: 'Родитель + дети' },
  { key: 'family', label: 'Семья (2 родителя + дети)' },
  { key: 'three_gen', label: 'Три поколения' }
];

export default function TemplateSelector({ onSelect }) {
  return (
    <div style={{ margin: '16px 0' }}>
      <h4>Выберите шаблон для старта:</h4>
      <ul>
        {templates.map(t => (
          <li key={t.key}>
            <button onClick={() => onSelect(t.key)}>{t.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
