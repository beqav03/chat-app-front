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
  friendId: number;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket, selectedFriendId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDove, setShowDove] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await fetchWithAuth("/profile");
      if (response && response.ok) {
        const data = await response.json();
        setUserId(data.id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedFriendId && userId) {
        try {
          const response = await fetchWithAuth(`/chat/history/${selectedFriendId}?userId=${userId}`, {
            method: "GET",
          });
          if (!response || !response.ok) throw new Error("Failed to fetch chat history");
          const history: Message[] = await response.json();

          setMessages(history || []);
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setError("Failed to load chat history");

          setMessages([]);
        }
      }
    };
    fetchChatHistory();
  }, [selectedFriendId, userId]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriendId || !userId) return;
    setIsSending(true);
    setError(null);
    try {
      const timestamp = new Date().toISOString();
      const payload = { userId, message, friendId: selectedFriendId };
  
      socket.emit("message", payload);
  
      setMessages((prev) => [...prev, { ...payload, timestamp }]);
      setMessage("");
      setShowDove(true);
      setTimeout(() => setShowDove(false), 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (selectedFriendId) {
      socket.emit("typing", { friendId: selectedFriendId });
      setTimeout(() => socket.emit("stop_typing", { friendId: selectedFriendId }), 2000);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (msg: Message) => {
      console.log("Received message:", msg);
      if (
        (msg.userId === userId && msg.friendId === selectedFriendId) ||
        (msg.userId === selectedFriendId && msg.friendId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Listen for typing events
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
  }, [socket, selectedFriendId, userId]);

  return (
    <div className={styles.chatSection}>
      {showDove && <DoveAnimation />}
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${msg.userId === userId ? styles.userMessage : ""}`}
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
            handleTyping(); // Call the handleTyping function
          }}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default ChatSection;