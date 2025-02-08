"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/sidebar.module.css";

const socket = io("http://localhost:3000");

interface Friend {
  id: number;
  name: string;
  photo: string;
  active: boolean;
}

const Sidebar: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
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
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch("http://localhost:3000/friends", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to load friends");
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {friends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            <div className={styles.friendPhotoContainer}>
              <img src={friend.photo} alt={friend.name} className={styles.friendPhoto} />
              <div className={`${styles.statusIndicator} ${friend.active ? styles.active : styles.inactive}`}></div>
            </div>
            <span className={styles.friendName}>{friend.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;