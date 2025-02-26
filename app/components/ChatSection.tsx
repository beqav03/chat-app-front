import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import styles from "../styles/chatsection.module.css";
import { fetchWithAuth } from "../utils/api";
import DoveAnimation from "./DoveAnimation";

interface ChatSectionProps {
  socket: Socket;
  selectedFriendId: number | null;
}

interface Message {
  userId: number;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket, selectedFriendId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDove, setShowDove] = useState(false);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedFriendId) {
        try {
          const response = await fetchWithAuth(`/chat/history/${selectedFriendId}`);
          if (!response || !response.ok) throw new Error("Failed to fetch chat history");
          const history = await response.json();
          setMessages(history);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
    fetchChatHistory();
  }, [selectedFriendId]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriendId) return;
    setShowDove(true);
    const timestamp = new Date().toISOString();
    await fetchWithAuth("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message, timestamp, friendId: selectedFriendId }),
    });
    socket.emit("send_message", { message, timestamp, userId: selectedFriendId });
    setMessage("");
    setTimeout(() => setShowDove(false), 2000);
  };

  return (
    <div className={styles.chatSection}>
      {showDove && <DoveAnimation />}
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${msg.userId === selectedFriendId ? styles.userMessage : ""}`}
          >
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