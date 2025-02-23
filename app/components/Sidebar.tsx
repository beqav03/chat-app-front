"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";

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
  }

  const Sidebar: React.FC<SidebarProps> = ({ userId }) => {
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetchWithAuth(`/friends/${userId}`);
        if (!response || !response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFilteredFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleAcceptFriendRequest = async (requestId: number) => {
    try {
      const response = await fetchWithAuth(`/friends/accept/${requestId}`, {
        method: "POST",
      });
      if (!response || !response.ok) throw new Error("Failed to accept friend request");

      setFilteredFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === requestId ? { ...friend, status: "accepted" } : friend
        )
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (requestId: number) => {
    try {
      const response = await fetchWithAuth(`/friends/reject/${requestId}`, {
        method: "POST",
      });
      if (!response || !response.ok) throw new Error("Failed to reject friend request");

      setFilteredFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === requestId ? { ...friend, status: "rejected" } : friend
        )
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {filteredFriends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            <div className={styles.friendPhotoContainer}>
              <Image
                src={friend.photo}
                alt={friend.name}
                width={50}
                height={50}
                className={styles.friendPhoto}
              />
              <div
                className={`${styles.statusIndicator} ${
                  friend.status === "accepted"
                    ? styles.active
                    : friend.status === "pending"
                    ? styles.pending
                    : styles.inactive
                }`}
              ></div>
            </div>

            <span className={styles.friendName}>
              {friend.name} {friend.lastname}
            </span>

            {friend.status === "pending" && (
              <>
                <span className={styles.pendingIcon}>⏳</span> {/* Pending Indicator */}
                <div className={styles.friendActions}>
                  <button onClick={() => handleAcceptFriendRequest(friend.id)}>Accept</button>
                  <button onClick={() => handleRejectFriendRequest(friend.id)}>Reject</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;