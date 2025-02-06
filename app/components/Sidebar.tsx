import React from 'react';
import styles from '../styles/sidebar.module.css';

const friends = [
  { name: "Friend 1", photo: "/images/friend1.jpg", active: true },
  { name: "Friend 2", photo: "/images/friend2.jpg", active: false },
  { name: "Friend 3", photo: "/images/friend3.jpg", active: true },
];

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {friends.map((friend, index) => (
          <li key={index} className={styles.friendItem}>
            <div className={styles.friendPhotoContainer}>
              <img
                src={friend.photo}
                alt={friend.name}
                className={styles.friendPhoto}
              />
              <div
                className={`${styles.statusIndicator} ${friend.active ? styles.active : styles.inactive}`}
              ></div>
            </div>
            <span className={styles.friendName}>{friend.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;