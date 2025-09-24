import React from 'react';

function TeamPage() {
  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">Команда</h2>
      <p>Lapida Token — команда профессионалов в блокчейне, финансах, маркетинге и разработке.</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Иван Иванов — CEO</li>
        <li>Мария Петрова — CTO</li>
        <li>Алексей Смирнов — Lead Developer</li>
        <li>Ольга Кузнецова — Marketing</li>
      </ul>
    </div>
  );
}

export default TeamPage;
