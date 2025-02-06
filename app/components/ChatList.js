import React from 'react';
import "../styles/layout.css";


const ChatList = ({ chats, onChatSelect }) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat.id} onClick={() => onChatSelect(chat)}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
