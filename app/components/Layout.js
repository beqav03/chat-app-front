import React, { useState, useEffect } from 'react';
import ChatList from './ChatList'; // Import your chat list component
import ChatWindow from './ChatWindow'; // Import your existing chat window component

const Layout = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Fetch chat list from the backend
  useEffect(() => {
    const fetchChats = async () => {
      // Replace with your API request to fetch chats (this is just an example)
      const response = await fetch('/api/chats/1'); // Example: user ID 1
      const data = await response.json();
      setChats(data);
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <ChatList chats={chats} onChatSelect={handleChatSelect} />
      </div>
      <div className="chat-window">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div>Select a chat to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Layout;
