"use client";
import React, { useState } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp"; // Import the main app

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  const handleLogin = () => {
    // Placeholder for authentication logic (e.g., API call)
    setIsAuthenticated(true); // Simulate successful login
  };

  const handleRegister = () => {
    // Placeholder for registration logic
    setIsRegistering(false);
  };

  if (isAuthenticated) {
    return <MainApp />; // Show main app if logged in
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {isRegistering ? (
          <>
            <h2>Register</h2>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button onClick={handleRegister}>Register</button>
            <p onClick={() => setIsRegistering(false)}>Already have an account? Login</p>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <p onClick={() => setIsRegistering(true)}>Don't have an account? Register</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;