"use client";
import { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage";
import MainApp from "./components/MainApp";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <MainApp onLogout={() => setIsAuthenticated(false)} />;
  }

  return <AuthPage />;
}