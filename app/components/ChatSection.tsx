"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "../styles/chatsection.module.css";

const socket = io("https://back-end.com.ge"); // Connect to backend WebSocket

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    fetch("https://back-end.com.ge/chat/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socket.on("new_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

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