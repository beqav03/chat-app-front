"use client"
import React, { useState } from 'react';
import styles from '../styles/chatsection.module.css';

interface Message {
  content: string;
  sender: {
    name: string;
    photo: string;
    isActive: boolean;
    isUser: boolean; // New field to differentiate user from friend
  };
  timestamp: string;
}

const ChatSection: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: 'Hello!',
      sender: { name: 'John Doe', photo: 'https://via.placeholder.com/50', isActive: true, isUser: false },
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      content: 'Hi there!',
      sender: { name: 'You', photo: 'https://via.placeholder.com/50', isActive: true, isUser: true },
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        content: inputText,
        sender: { name: 'You', photo: 'https://via.placeholder.com/50', isActive: true, isUser: true },
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <main className={styles.chatSection}>
      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div key={index} className={message.sender.isUser ? styles.userMessage : styles.friendMessage}>
              <div className={styles.messageHeader}>
                <img src={message.sender.photo} alt={message.sender.name} className={styles.userPhoto} />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{message.sender.name}</div>
                  <div className={styles.userStatus}>
                    {message.sender.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className={styles.timestamp}>{message.timestamp}</div>
              </div>
              <div className={styles.messageContent}>{message.content}</div>
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </main>
  );
};

export default ChatSection;