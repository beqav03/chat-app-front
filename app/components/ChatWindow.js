import React from 'react';
import "../styles/layout.css";

const ChatWindow = ({ chat }) => {
  return (
    <div className="chat-window">
      <h2>{chat.name}</h2>
      <div className="messages">
        {chat.messages.map((message) => (
          <div key={message.id}>
            <strong>{message.sender}</strong>: {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
