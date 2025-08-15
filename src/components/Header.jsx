// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ onLogout }) {
  const location = useLocation();

  return (
    <header
      style={{
        padding: "12px 24px",
        background: "#2c7be5",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <nav style={{ display: "flex", gap: 16 ,justifyContent: "space-between", alignItems: "center"}}>
        <Link
          to="/"
          style={{
            color: location.pathname === "/" ? "yellow" : "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          POS
        </Link>
        <Link
          to="/history"
          style={{
            color: location.pathname === "/history" ? "yellow" : "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          History
        </Link>
        <Link
          to="/expenses"
          style={{
            color: location.pathname === "/expenses" ? "yellow" : "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Expenses
        </Link>
        <div style={{fontWeight:'bolder',fontSize:25,marginLeft:270}}>Karnavati Dabeli & Vadapav Botad</div>
      </nav>

      <button
        onClick={onLogout}
        style={{
          background: "transparent",
          border: "1px solid white",
          color: "white",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </header>
  );
}
