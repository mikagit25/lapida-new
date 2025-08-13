import React, { useState } from 'react';
import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatWindow(true);
  };

  const handleCloseChatWindow = () => {
    setShowChatWindow(false);
    setSelectedChat(null);
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Левая панель - список чатов */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 ${showChatWindow ? 'hidden md:block' : 'block'}`}>
        <ChatsList 
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Правая панель - окно чата */}
      <div className={`w-full md:w-2/3 ${showChatWindow ? 'block' : 'hidden md:block'}`}>
        <ChatWindow 
          chat={selectedChat}
          onClose={handleCloseChatWindow}
        />
      </div>
    </div>
  );
};

export default Messages;
