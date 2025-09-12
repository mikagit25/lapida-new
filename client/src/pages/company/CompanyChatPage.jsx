import React from 'react';
import { useParams } from 'react-router-dom';
import ChatsList from '../../components/ChatsList';
import { useAuth } from '../../context/AuthContext';

export default function CompanyChatPage() {
  const { id, companySlug } = useParams();
  const companyId = id || companySlug;
  const { user } = useAuth();

  // Можно добавить логику фильтрации чатов по компании, если потребуется

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Чат компании</h1>
      <ChatsList companyId={companyId} user={user} />
    </div>
  );
}
