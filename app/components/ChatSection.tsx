"use client";
import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import styles from "../styles/chatsection.module.css";

interface ChatSectionProps {
  socket: Socket;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket }) => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: { sender: string; content: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const message = { sender: "You", content: inputText };
      socket.emit("send_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputText("");
    }
  };

  return (
    <main className={styles.chatSection}>
      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === "You" ? styles.userMessage : styles.friendMessage}>
              <strong>{msg.sender}</strong>: {msg.content}
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