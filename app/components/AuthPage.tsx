"use client";
import React, { useState } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp";
import router from "next/router";

const AuthPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://back-end.com.ge/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <MainApp onLogout={handleLogout} />;
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => router.push('/register')} style={{ marginTop: '10px', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          <p>{"Don't have an account? Register here."}</p>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;