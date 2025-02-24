"use client";

import { useState } from "react";

export default function EmailConfigForm() {
  const [emailAddress, setEmailAddress] = useState("");
  const [connectionType, setConnectionType] = useState("IMAP");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/email-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailAddress,
        connectionType,
        username,
        password,
        host,
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        placeholder="Email Address"
        required
      />
      <select
        value={connectionType}
        onChange={(e) => setConnectionType(e.target.value)}>
        <option value="IMAP">IMAP</option>
        <option value="POP3">POP3</option>
      </select>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        placeholder="IMAP/POP3 Host"
        required
      />
      <button type="submit">Save Configuration</button>
    </form>
  );
}
