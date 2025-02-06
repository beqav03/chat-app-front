import React from 'react';
import styles from '../styles/chatsection.module.css';

const ChatSection = () => {
    return (
        <main className={styles.chatSection}>
            <div className={styles.chatWindow}>
                <div className={styles.messages}>
                    {/* Chat messages will go here */}
                    <div className={styles.message}>Hello!</div>
                    <div className={styles.message}>Hi there!</div>
                </div>
                <div className={styles.inputContainer}>
                    <input type="text" placeholder="Type a message..." />
                    <button>Send</button>
                </div>
            </div>
        </main>
    );
};

export default ChatSection;
