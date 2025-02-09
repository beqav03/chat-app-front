"use client";
import React, { useState } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp";

const AuthPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      const url = isRegistering
        ? "http://back-end.com.ge/user/register"
        : "http://back-end.com.ge/auth/login";

      const body = isRegistering
        ? JSON.stringify({ name, email, password, confirmPassword })
        : JSON.stringify({ email, password });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        throw new Error(isRegistering ? "Registration failed" : "Login failed");
      }

      const data = await response.json();
      if (!isRegistering) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      } else {
        // Registration successful, switch to login
        setIsRegistering(false);
      }
    } catch (err:any) {
      setError(err.message);
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
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button onClick={handleAuth}>{isRegistering ? "Register" : "Login"}</button>

        <p
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            marginTop: "10px",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isRegistering
            ? "Already have an account? Log in here."
            : "Don't have an account? Register here."}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;