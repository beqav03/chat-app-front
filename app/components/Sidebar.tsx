"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";
import DoveAnimation from "./DoveAnimation";

interface Friend {
  id: number;
  name: string;
  lastname: string;
  photo: string;
  status: "pending" | "accepted" | "rejected";
}

interface SidebarProps {
  friends: Friend[];
  searchQuery: string;
  userId: number;
  onSelectFriend: (friendId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userId, searchQuery, onSelectFriend }) => {
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [showDove, setShowDove] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetchWithAuth(`/friends/${userId}`);
        if (!response || !response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        const mappedFriends = data.map((friend: any) => ({
          id: friend.friend_id,
          name: friend.user_name,
          lastname: friend.user_lastname,
          photo: friend.profilePicture || "https://via.placeholder.com/50",
          status: friend.status,
        }));
        setFilteredFriends(
          mappedFriends.filter((friend: Friend) =>
            `${friend.name} ${friend.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [userId, searchQuery]);

  const handleFriendClick = async (friendId: number) => {
    try {
      const response = await fetchWithAuth(`/chat/history/${friendId}`);
      if (!response || !response.ok) throw new Error("Failed to fetch chat history");
      onSelectFriend(friendId);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleAcceptFriendRequest = async (requestId: number) => {
    setShowDove(true);
    try {
      const response = await fetchWithAuth(`/friends/accept/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to accept friend request");
      setFilteredFriends((prev) =>
        prev.map((friend) => (friend.id === requestId ? { ...friend, status: "accepted" } : friend))
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setTimeout(() => setShowDove(false), 2000);
    }
  };

  const handleRejectFriendRequest = async (requestId: number) => {
    setShowDove(true);
    try {
      const response = await fetchWithAuth(`/friends/reject/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to reject friend request");
      setFilteredFriends((prev) =>
        prev.map((friend) => (friend.id === requestId ? { ...friend, status: "rejected" } : friend))
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setTimeout(() => setShowDove(false), 2000);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {showDove && <DoveAnimation />}
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className={styles.friendItem}
            onClick={() => friend.status === "accepted" && handleFriendClick(friend.id)}
          >
            <div className={styles.friendPhotoContainer}>
              <Image
                src={friend.photo}
                alt={friend.name}
                width={50}
                height={50}
                className={styles.friendPhoto}
              />
            </div>
            <span className={styles.friendName}>
              {friend.name} {friend.lastname} ({friend.status})
            </span>
            {friend.status === "pending" && (
              <div className={styles.friendActions}>
                <button
                  className={styles.acceptButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptFriendRequest(friend.id);
                  }}
                >
                  ✅ Accept
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectFriendRequest(friend.id);
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;