import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";
import { fetchWithAuth } from "../utils/api";
import ProfileModal from "./ProfileModal";

interface MainAppProps {
  onLogout: () => void;
}

interface Friend {
  id: number;
  name: string;
  photo: string;
  active: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to toggle ProfileModal
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added this
  const router = useRouter();

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/friends");
      if (!response) return;
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Failed to fetch friends");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchFriends();

    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/socket.io`, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("friend_status", (updatedFriend: Friend) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === updatedFriend.id
            ? { ...friend, active: updatedFriend.active }
            : friend
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("friend_status");
      newSocket.disconnect();
    };
  }, [router, fetchFriends]);

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} onProfileClick={() => setIsProfileOpen(true)} setSearchQuery={setSearchQuery} /> {/* ✅ Fixed: Passed setSearchQuery */}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
      <Sidebar friends={friends} searchQuery={searchQuery} /> {/* ✅ Fixed: Passed searchQuery */}
      {socket && <ChatSection socket={socket} />}
      </div>
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default MainApp;