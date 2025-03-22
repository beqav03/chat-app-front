"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";
import { fetchWithAuth } from "../utils/api";
import ProfileModal from "./ProfileModal";

interface Friend {
  id: number;
  name: string;
  lastname: string;
  photo: string;
  status: "pending" | "accepted" | "rejected";
}

interface ApiFriend {
  friend_id: number;
  user_name: string;
  user_lastname: string;
  profilePicture?: string;
  status: "pending" | "accepted" | "rejected";
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
}

const MainApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.setAttribute("data-theme", isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/profile");
      if (!response) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data: UserProfile = await response.json();
      setUserId(data.id);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
      router.replace("/login");
    }
  }, [router]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`/friends/${userId}`);
      if (!response) return;
      const data: ApiFriend[] = await response.json();
      const mappedFriends: Friend[] = data.map((friend) => ({
        id: friend.friend_id,
        name: friend.user_name,
        lastname: friend.user_lastname,
        photo: friend.profilePicture || "https://via.placeholder.com/50",
        status: friend.status,
      }));
      setFriends(mappedFriends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Failed to fetch friends");
    }
  }, [userId]);

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriendId(friendId);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchUserProfile();
    fetchFriends();

    const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("friend_status", (updatedFriend: { requestId: number; status: string }) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === updatedFriend.requestId ? { ...friend, status: updatedFriend.status as "pending" | "accepted" | "rejected" } : friend
        )
      );
    });

    newSocket.on("friend_request", (request: { senderId: number; receiverId: number; status: string }) => {
      if (request.receiverId === userId) {
        fetchFriends();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("friend_status");
      newSocket.off("friend_request");
      newSocket.disconnect();
    };
  }, [router, fetchFriends, fetchUserProfile, userId]);

  return (
    <div className={styles.mainApp}>
      <Header
        onLogout={onLogout}
        onProfileClick={() => setIsProfileOpen(true)}
        setSearchQuery={setSearchQuery}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
        {userId && (
          <Sidebar
            friends={friends}
            searchQuery={searchQuery}
            userId={userId}
            onSelectFriend={handleSelectFriend}
          />
        )}
        {socket && <ChatSection socket={socket} selectedFriendId={selectedFriendId} />}
      </div>
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default MainApp;