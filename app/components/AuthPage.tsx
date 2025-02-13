"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp";
import { fetchWithAuth } from "../utils/api"; 

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
      const url = isRegistering ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
      const body = isRegistering
        ? JSON.stringify(formData)
        : JSON.stringify({ email: formData.email, password: formData.password });

        const response = await fetchWithAuth(url, { 
          method: "POST", 
          body: JSON.stringify(formData) 
        });

      if (!response || !response.ok) {
        throw new Error("Authentication failed.");
      }

      const responseData = await response.json();

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
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        )}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

        {isRegistering && (
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
        )}

        <button onClick={handleAuth}>{isRegistering ? "Register" : "Login"}</button>

        <p onClick={() => setIsRegistering(!isRegistering)} className={styles.toggleText}>
          {isRegistering ? "Already have an account? Log in here." : "Don't have an account? Register here."}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;