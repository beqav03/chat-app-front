"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";
import { fetchWithAuth } from "../utils/api"; // Import API helper

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string);

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Redirect if no token
      return;
    }

    const fetchUserProfile = async () => {
      const response = await fetchWithAuth("/profile");
      if (!response) {
        onLogout(); // Logout if unauthorized
        return;
      }
      const data = await response.json();
      setUser(data);
    };

    const fetchFriends = async () => {
      const response = await fetchWithAuth("/friends");
      if (response) {
        const data = await response.json();
        setFriends(data);
      }
    };

    fetchUserProfile();
    fetchFriends();

    socket.on("friend_status", (updatedFriend: Friend) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === updatedFriend.id ? { ...friend, active: updatedFriend.active } : friend
        )
      );
    });

    return () => {
      socket.off("friend_status");
    };
  }, [router, onLogout]);

  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} />
      <div className={styles.content}>
        <Sidebar friends={friends} />
        <ChatSection socket={socket} />
      </div>
    </div>
  );
};

export default MainApp;