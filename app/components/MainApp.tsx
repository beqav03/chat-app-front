"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css"; // Add new styles

const MainApp: React.FC = () => {
  return (
    <div className={styles.mainApp}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <ChatSection />
      </div>
    </div>
  );
};

export default MainApp;