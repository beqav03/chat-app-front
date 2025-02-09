"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";

const socket = io("https://back-end.com.ge");

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
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/"); // Redirect to login if no token
        return;
      }
      try {
        const response = await fetch("https://back-end.com.ge/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        router.replace("/");
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await fetch("https://back-end.com.ge/friends", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to load friends");
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
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
  }, [router]);

  if (!user) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} />
      <div className={styles.content}>
        <Sidebar friends={friends} />
        <ChatSection />
      </div>
    </div>
  );
};

export default MainApp;