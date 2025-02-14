import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import styles from "../styles/chatsection.module.css";
import { fetchWithAuth } from "../utils/api";

interface ChatSectionProps {
  socket: Socket;
}

interface Message {
  userId: number;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toISOString();
    await fetchWithAuth("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message, timestamp }),
    });

    socket.emit("send_message", { message, timestamp });
    setMessage("");
  };

  return (
    <div className={styles.chatSection}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            <div className={styles.messageHeader}>
              <span className={styles.userName}>User {msg.userId}</span>
              <span className={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className={styles.messageContent}>{msg.message}</div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSection;