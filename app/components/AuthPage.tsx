"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp";

const AuthPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (): Promise<void> => {
    try {
      const url = isRegistering
        ? "https://back-end.com.ge/user/register"
        : "https://back-end.com.ge/auth/login";

      const body = isRegistering
        ? JSON.stringify(formData)
        : JSON.stringify({ email: formData.email, password: formData.password });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || (isRegistering ? "Registration failed" : "Login failed"));
      }

      if (!isRegistering) {
        localStorage.setItem("token", responseData.token);
        setIsAuthenticated(true);
      } else {
        setIsRegistering(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleLogout = (): void => {
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
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {isRegistering && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        )}

        <button onClick={handleAuth}>{isRegistering ? "Register" : "Login"}</button>

        <p
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ marginTop: "10px", color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
        >
          {isRegistering ? "Already have an account? Log in here." : "Don't have an account? Register here."}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;