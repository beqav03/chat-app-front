"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import BellIcon from "../icons/bell.svg";
import BurgerMenu from "../icons/menuburger.svg";
import MagnifyingGlass from "../icons/magnifying-glass.svg";
import Logo from "../icons/chat.svg";
import Close from "../icons/close.svg";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";
import DoveAnimation from "./DoveAnimation";
import Notification from "./Notification";

interface HeaderProps {
  onLogout: () => void;
  setSearchQuery: (query: string) => void;
  onProfileClick?: () => void;
}

interface User {
  id: number;
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
  const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showDove, setShowDove] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await fetchWithAuth("/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    onLogout();
    setShowLogoutConfirm(false);
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
      setIsSearchResultsVisible(true);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      setIsSearchResultsVisible(true);
    }
  };

  const sendFriendRequest = async (receiverId: number) => {
    setShowDove(true);
    try {
      const response = await fetchWithAuth(`/friends/request/${receiverId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to send friend request");
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    } finally {
      setTimeout(() => setShowDove(false), 2000);
    }
  };

  const closeSearchResults = () => {
    setIsSearchResultsVisible(false);
  };

  const handleNotificationClick = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <header className={styles.header}>
        {showDove && <DoveAnimation />}
        <div className={styles.logo}>
          <Image src={Logo} alt="Search" width={50} height={50} />
        </div>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search Friends"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li key={index} onClick={() => handleNotificationClick(index)}>
                        {notification}
                      </li>
                    ))
                  ) : (
                    <li>No message</li>
                  )}
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
      {isSearchResultsVisible && (
        <div className={styles.searchResults}>
          <button className={styles.closeButton} onClick={closeSearchResults}>
            <Image src={Close} alt="Close" width={16} height={16} />
          </button>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((user, index) => (
                <li key={index}>
                  <span>{user.name} {user.lastname}</span> - <span>{user.email}</span>
                  <button onClick={() => sendFriendRequest(user.id)}>+</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noResults}>No one was found.</p>
          )}
        </div>
      )}
      {requestSent && (
        <Notification
          message="Friend request sent successfully!"
          type="success"
          onClose={() => setRequestSent(false)}
        />
      )}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={() => setShowLogoutConfirm(false)}>No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;