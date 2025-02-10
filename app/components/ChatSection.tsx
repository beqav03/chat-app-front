import React, { useState, useEffect } from "react";
import styles from "./styles/chat.module.css";
import { fetchWithAuth } from "../utils/api"; // Import API helper

interface ChatSectionProps {
  socket: any;
}

const ChatSection: React.FC<ChatSectionProps> = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ userId: number; message: string }[]>([]);

  useEffect(() => {
    socket.on("message", (msg: { userId: number; message: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await fetchWithAuth("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    socket.emit("send_message", { message });

    setMessage("");
  };

  return (
    <div className={styles.chatSection}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatSection;