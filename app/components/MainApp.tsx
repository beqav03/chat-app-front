"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatSection from "./ChatSection";
import styles from "../styles/mainapp.module.css";

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // Redirect to login if no token
        return;
      }
      try {
        const response = await fetch("http://back-end.com.ge/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    };
    fetchUserProfile();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.mainApp}>
      <Header onLogout={onLogout} />
      <div className={styles.content}>
        <Sidebar />
        <ChatSection />
      </div>
    </div>
  );
};

export default MainApp;