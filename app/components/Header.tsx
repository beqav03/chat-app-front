"use client";
import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import ProfileModal from "./ProfileModal";
import BellIcon from "../icons/bell.svg";
import BurgerMenu from "../icons/menuburger.svg";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("https://back-end.com.ge/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.search}>
          <input type="text" placeholder="Search People" />
        </div>
        <div className={styles.icons}>
          <span className={styles.icon}>
            <img src={BellIcon} alt="Notifications" className={styles.icon} />
          </span>
          <span
            className={styles.icon}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <img src={BurgerMenu} alt="Menu" className={styles.icon} />
            {dropdownVisible && (
              <div className={styles.dropdown}>
                <ul>
                  <li onClick={() => setIsProfileOpen(true)}>Profile</li>
                  <li>Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </span>
        </div>
      </header>

      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
    </>
  );
};

export default Header;