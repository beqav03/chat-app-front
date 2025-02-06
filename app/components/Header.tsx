"use client"
import React, { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css';
import Bell from '../icons/bell'; // Import the Notification component
import BurgerMenu from '../icons/BurgerMenu'; // Import the Notification component

const Header: React.FC = () => {
  // Example state for new messages
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);

  // Simulate new messages being received after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessages(true);
    }, 3000); // Simulate receiving a message after 3 seconds

    return () => clearTimeout(timer); // Clean up timer
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Logo</div>
      <div className={styles.search}>
        <input type="text" placeholder="Search People" />
      </div>
      <div className={styles.icons}>
        <span className={styles.icon}>
          <Bell />
        </span>
        <span className={styles.icon}>
          <BurgerMenu />
        </span>
      </div>
    </header>
  );
};

export default Header;