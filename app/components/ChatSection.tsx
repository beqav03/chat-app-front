"use client"
import React, { useState } from 'react';
import styles from '../styles/chatsection.module.css';

const ChatSection: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<string[]>(['Hello!', 'Hi there!']);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, inputText]);
      setInputText('');
    }
  };

  return (
    <main className={styles.chatSection}>
      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div key={index} className={styles.message}>
              {message}
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
