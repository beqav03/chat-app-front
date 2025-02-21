"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import BellIcon from "../icons/bell.svg";
import BurgerMenu from "../icons/menuburger.svg";
import MagnifyingGlass from "../icons/magnifying-glass.svg";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";

interface HeaderProps {
  onLogout: () => void;
  setSearchQuery: (query: string) => void;
  onProfileClick?: () => void;
}

interface User {
  name: string;
  lastname: string;
  email: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, setSearchQuery, onProfileClick }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

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

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput);
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/search?keyword=${searchInput}`);
      if (!response || !response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      setSearchResults(data);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (email: string) => {
    try {
      const response = await fetchWithAuth("/friends/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!response || !response.ok) throw new Error("Failed to send friend request");
      alert("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
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
      {searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <ul>
            {searchResults.map((user, index) => (
              <li key={index}>
                <span>{user.name} {user.lastname}</span> - <span>{user.email}</span>
                <button onClick={() => sendFriendRequest(user.email)}>+</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;