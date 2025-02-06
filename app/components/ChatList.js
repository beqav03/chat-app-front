import React from 'react';
import "../styles/layout.css";

const ChatList = ({ chats, onChatSelect }) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat.id} onClick={() => onChatSelect(chat)}>
          <img className="chat-avatar" src={chat.avatar || "/default-avatar.png"} alt={chat.name} />
          <div>
            <strong>{chat.name}</strong>
            <p className="message-time">{chat.lastMessageTime || "Just now"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
