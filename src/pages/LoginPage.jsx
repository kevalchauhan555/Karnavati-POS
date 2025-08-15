// src/pages/LoginPage.jsx
import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (onLogin(username.trim(), password)) {
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          width: 320,
        }}
      >
        <h2 style={{ marginBottom: 16, textAlign: "center" }}>Login</h2>

        <label style={{ display: "block", marginBottom: 8 }}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              boxSizing: "border-box",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              boxSizing: "border-box",
            }}
          />
        </label>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: 16,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#2c7be5",
            border: "none",
            borderRadius: 4,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
