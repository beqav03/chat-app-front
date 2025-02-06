"use client";  // Add this at the very top
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import style from "../styles/Header.module.css"; // Import styles

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={style.header}>
      {/* Logo */}
      <div className={style.logo}>ChatApp</div>

      {/* Search Bar */}
      <div className={style.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          className={style.searchInput}
        />
      </div>

      {/* Burger Menu */}
      <div className={style.menu}>
        <button onClick={() => setMenuOpen(!menuOpen)} className={style.menuButton}>
          <FaBars size={24} />
        </button>
        {menuOpen && (
          <div className={style.menuDropdown}>
            <a href="#" className={style.menuItem}>Profile</a>
            <a href="#" className={style.menuItem}>Settings</a>
            <a href="#" className={style.menuItem}>Logout</a>
          </div>
        )}
      </div>
    </header>
  );
}
