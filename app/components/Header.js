import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.search}>
                <input type="text" placeholder="Search People" />
            </div>
            <div className={styles.icons}>
                <span className={styles.icon}>🔔</span>
                <span className={styles.icon}>☰</span>
            </div>
        </header>
    );
};

export default Header;
