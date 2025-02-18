"use client";
import React from "react";
import styles from "../styles/sidebar.module.css";
import Image from "next/image";

interface Friend {
  id: number;
  name: string;
  photo: string;
  active: boolean;
}

interface SidebarProps {
  friends: Friend[];
  searchQuery: string;
}

const Sidebar: React.FC<SidebarProps> = ({ friends, searchQuery }) => {
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {filteredFriends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            <div className={styles.friendPhotoContainer}>
              <Image src={friend.photo} alt={friend.name} width={50} height={50} className={styles.friendPhoto} />
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