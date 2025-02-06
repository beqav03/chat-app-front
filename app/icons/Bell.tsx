import React from 'react';
import styles from '../styles/Header.module.css'; // Adjust the path accordingly

const BellIcon: React.FC = () => {
  return (
    <span className={styles.icon}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.bellIcon}
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 3.3-2 6-2 6h16s-2-2.7-2-6z" />
        <path d="M12 2a2 2 0 0 1 2 2v6h-4V4a2 2 0 0 1 2-2z" />
        <path d="M12 20a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
      </svg>
    </span>
  );
};

export default BellIcon;
