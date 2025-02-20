"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import BellIcon from "../icons/bell.svg";
import BurgerMenu from "../icons/menuburger.svg";
import MagnifyingGlass from "../icons/magnifying-glass.svg"; // Import the magnifying glass icon
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";

interface HeaderProps {
  onLogout: () => void;
  setSearchQuery: (query: string) => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, setSearchQuery, onProfileClick }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleLogout = async () => {
    await fetchWithAuth("/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    onLogout();
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithAuth("/notifications");
      if (!response) return;
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search Friends"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <span className={styles.searchIcon} onClick={handleSearch}>
            <Image src={MagnifyingGlass} alt="Search" width={20} height={20} />
          </span>
        </div>
        <div className={styles.icons}>
          <span className={styles.icon} onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
            <Image src={BellIcon} alt="Notifications" width={30} height={30} />
            {isNotificationsOpen && (
              <div className={styles.notificationsDropdown}>
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                  ))}
                </ul>
              </div>
            )}
          </span>
          <span
            className={styles.icon}
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <Image src={BurgerMenu} alt="Menu" width={30} height={30} />
            {dropdownVisible && (
              <div className={styles.dropdown}>
                <ul>
                  <li onClick={onProfileClick}>Profile</li>
                  <li>Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;