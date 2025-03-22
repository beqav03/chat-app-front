"use client";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import styles from "../styles/chatsection.module.css";
import { fetchWithAuth } from "../utils/api";

interface ChatSectionProps {
  socket: Socket;
  selectedFriendId: number | null;
}

interface Message {
  id: number;
  userId: number;
  friendId: number;
  message: string;
  timestamp: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket, selectedFriendId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (!socket || !userId || !selectedFriendId) return;

    const fetchChatHistory = async () => {
      try {
        const response = await fetchWithAuth(`/chat/history/${selectedFriendId}?userId=${userId}`);
        if (!response || !response.ok) throw new Error("Failed to fetch chat history");
        const history: Message[] = await response.json();
        setMessages(history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    socket.on("message", (msg: Message) => {
      if (
        (msg.userId === userId && msg.friendId === selectedFriendId) ||
        (msg.userId === selectedFriendId && msg.friendId === userId)
      ) {
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
  }, [socket, selectedFriendId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedFriendId || !userId) return;
    
    const payload = { userId, message, friendId: selectedFriendId };
    
    try {
      const response = await fetchWithAuth("/chat/send", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      if (!response || !response.ok) throw new Error("Failed to send message");
      await response.json();
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    if (selectedFriendId) {
      socket.emit("typing", { friendId: selectedFriendId });
      setTimeout(() => socket.emit("stop_typing", { friendId: selectedFriendId }), 2000);
    }
  };

  return (
    <div className={styles.chatSection}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.userId === userId ? styles.userMessage : ""}`}
          >
            <div className={styles.messageHeader}>
              <span className={styles.userName}>User {msg.userId}</span>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className={styles.messageContent}>{msg.message}</div>
          </div>
        ))}
        {isTyping && <div className={styles.message}>Friend is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      {selectedFriendId && (
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
      )}
    </div>
  );
};

export default ChatSection;