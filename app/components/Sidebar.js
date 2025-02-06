import React from 'react';
import styles from '../styles/sidebar.module.css';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h2>Friends</h2>
            <ul>
                <li>Friend 1</li>
                <li>Friend 2</li>
                <li>Friend 3</li>
                {/* Add dynamic friends list here */}
            </ul>
        </aside>
    );
};

export default Sidebar;
