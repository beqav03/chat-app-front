"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

const Layout = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch("/api/chats/1");
      const data = await response.json();
      setChats(data);
    };

    fetchChats();
  }, []);

  return (
    <div className="layout">
      {/* Header at the top */}
      <Header />

      {/* Main content (flexbox for sidebar and chat window) */}
      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <ChatList chats={chats} onChatSelect={setSelectedChat} />
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <div className="placeholder">Select a chat to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
