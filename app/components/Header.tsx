import { useState } from "react";
import { FaBars } from "react-icons/fa";
import styles from "./Header.module.css"; // Import styles

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>ChatApp</div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
        />
      </div>

      {/* Burger Menu */}
      <div className={styles.menu}>
        <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuButton}>
          <FaBars size={24} />
        </button>
        {menuOpen && (
          <div className={styles.menuDropdown}>
            <a href="#" className={styles.menuItem}>Profile</a>
            <a href="#" className={styles.menuItem}>Settings</a>
            <a href="#" className={styles.menuItem}>Logout</a>
          </div>
        )}
      </div>
    </header>
  );
}
