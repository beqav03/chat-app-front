"use client"
import React, { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css';
import Bell from '../icons/bell'; // Import the Notification component
import BurgerMenu from '../icons/BurgerMenu'; // Import the Notification component

const Header: React.FC = () => {
  // Example state for new messages
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
        <span
          className={styles.icon}
          onMouseEnter={() => setDropdownVisible(true)}  // Show on hover
          onMouseLeave={() => setDropdownVisible(false)} // Hide on mouse leave
        >
          <BurgerMenu />
          {dropdownVisible && (
            <div className={styles.dropdown}>
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </span>
      </div>
    </header>
  );
};

export default Header;