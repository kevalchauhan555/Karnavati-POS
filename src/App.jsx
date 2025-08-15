// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import POSPage from "./pages/POSPage";
import HistoryPage from "./pages/HistoryPage";
import ExpensesPage from "./pages/ExpensesPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage if user already logged in
    const saved = localStorage.getItem("loggedIn");
    if (saved === "true") setLoggedIn(true);
  }, []);

  function handleLogin(username, password) {
    if (username === "admin" && password === "admin@9851") {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
      return true;
    }
    return false;
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<POSPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Routes>
    </>
  );
}
