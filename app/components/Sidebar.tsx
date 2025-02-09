"use client";
import React from "react";
import styles from "../styles/sidebar.module.css";

interface Friend {
  id: number;
  name: string;
  photo: string;
  active: boolean;
}

interface SidebarProps {
  friends: Friend[];
}

const Sidebar: React.FC<SidebarProps> = ({ friends }) => {
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