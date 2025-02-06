import React from 'react';
import styles from '../styles/sidebar.module.css';

interface Friend {
  id: string;
  name: string;
}

const Sidebar: React.FC = () => {
  const friends: Friend[] = [
    { id: '1', name: 'Friend 1' },
    { id: '2', name: 'Friend 2' },
    { id: '3', name: 'Friend 3' },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.id}>{friend.name}</li>
          ))
        ) : (
          <li>No friends yet</li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
