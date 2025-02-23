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
  lastname: string;
  photo: string;
  status: "pending" | "accepted" | "rejected";
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null); // Add userId state
  const router = useRouter();

  const fetchUserId = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/me");
      if (!response || !response.ok) throw new Error("Failed to fetch user ID");
      const data = await response.json();
      setUserId(data.id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setError("Failed to fetch user ID");
    }
  }, []);

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

    fetchUserId();
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
            ? { ...friend, status: updatedFriend.status }
            : friend
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("friend_status");
      newSocket.disconnect();
    };
  }, [router, fetchFriends, fetchUserId]);

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} onProfileClick={() => setIsProfileOpen(true)} setSearchQuery={setSearchQuery} />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
        {userId && (
          <Sidebar friends={friends} searchQuery={searchQuery} userId={userId} />
        )}
        {socket && <ChatSection socket={socket} />}
      </div>
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default MainApp;