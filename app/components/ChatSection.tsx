"use client";
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
  friendId?: number;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket, selectedFriendId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDove, setShowDove] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      if (msg.friendId === selectedFriendId || msg.userId === selectedFriendId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    socket.on("typing", ({ friendId }: { friendId: number }) => {
      if (friendId === selectedFriendId) setIsTyping(true);
    });
    socket.on("stop_typing", ({ friendId }: { friendId: number }) => {
      if (friendId === selectedFriendId) setIsTyping(false);
    });
    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, selectedFriendId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedFriendId) {
        try {
          const userId = (await fetchWithAuth("/profile"))?.json().then((data) => data.id);
          const response = await fetchWithAuth(`/chat/history/${selectedFriendId}`, {
            method: "GET",
            body: JSON.stringify({ userId }),
          });
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
    const userId = (await fetchWithAuth("/profile"))?.json().then((data) => data.id);
    await fetchWithAuth("/chat/send", {
      method: "POST",
      body: JSON.stringify({ userId, message, friendId: selectedFriendId }),
    });
    socket.emit("send_message", { userId, message, timestamp, friendId: selectedFriendId });
    setMessage("");
    setTimeout(() => setShowDove(false), 2000);
  };

  const handleTyping = () => {
    if (selectedFriendId) {
      socket.emit("typing", { friendId: selectedFriendId });
      setTimeout(() => socket.emit("stop_typing", { friendId: selectedFriendId }), 2000);
    }
  };

  return (
    <div className={styles.chatSection}>
      {showDove && <DoveAnimation />}
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${msg.userId === selectedFriendId ? "" : styles.userMessage}`}
          >
            <div className={styles.messageHeader}>
              <span className={styles.userName}>User {msg.userId}</span>
              <span className={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className={styles.messageContent}>{msg.message}</div>
          </div>
        ))}
        {isTyping && <div className={styles.message}>Friend is typing...</div>}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSection;