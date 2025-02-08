"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";

interface MainAppProps {
  onLogout: () => void; // Define type for onLogout
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} /> {/* Pass Logout Function */}
      <div className={styles.content}>
        <Sidebar />
        <ChatSection />
      </div>
    </div>
  );
};

export default MainApp;
