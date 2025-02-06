import React from 'react';
import "../styles/layout.css";

const ChatWindow = ({ chat }) => {
  return (
    <div className="chat-window">
      <h2>{chat.name}</h2>
      <div className="messages">
        {chat.messages.map((message) => (
          <div key={message.id} className={`message ${message.sender === 'me' ? 'sender' : 'receiver'}`}>
            <p>{message.text}</p>
            <span className="message-time">{message.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
