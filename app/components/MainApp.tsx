"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";
import { fetchWithAuth } from "../utils/api"; // Import API helper

interface MainAppProps {
  onLogout: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Friend {
  id: number;
  name: string;
  photo: string;
  active: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/profile");
      if (!response) throw new Error("Unauthorized");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      onLogout(); // Logout if unauthorized
    }
  }, [onLogout]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/friends");
      if (!response) return;
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // Redirect if no token
      return;
    }

    fetchUserProfile();
    fetchFriends();

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("friend_status", (updatedFriend: Friend) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === updatedFriend.id ? { ...friend, active: updatedFriend.active } : friend
        )
      );
    });

    return () => {
      socket.off("friend_status");
      socket.disconnect();
    };
  }, [router, fetchUserProfile, fetchFriends]);

  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} />
      <div className={styles.content}>
        <Sidebar friends={friends} />
        <ChatSection socket={io(process.env.NEXT_PUBLIC_BACKEND_URL!)} />
      </div>
    </div>
  );
};

export default MainApp;