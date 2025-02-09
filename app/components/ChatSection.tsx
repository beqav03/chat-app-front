"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/chatsection.module.css";

const socket = io("http://back-end.com.ge"); // Connect to the backend

interface Message {
  content: string;
  sender: {
    name: string;
    photo: string;
    isUser: boolean;
  };
  timestamp: string;
}

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    fetchMessages();
    socket.on("message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://back-end.com.ge/chat", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to load messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      content: inputText,
      sender: { name: "You", photo: "https://via.placeholder.com/50", isUser: true },
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    socket.emit("send_message", newMessage);
    setInputText("");

    try {
      await fetch("http://back-end.com.ge/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: inputText }),
      });
    } catch (error) {
      console.error("Failed to send message", error);
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
                  <div className={styles.timestamp}>{message.timestamp}</div>
                </div>
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