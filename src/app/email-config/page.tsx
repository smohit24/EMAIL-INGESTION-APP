"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailConfigPage() {
  const router = useRouter();
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [emailAddress, setEmailAddress] = useState("");
  const [connectionType, setConnectionType] = useState("IMAP");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  // Email provider options with default IMAP and POP3 hosts
  const emailProviders = [
    { name: "Gmail", imap: "imap.gmail.com", pop3: "pop.gmail.com" },
    {
      name: "Outlook",
      imap: "outlook.office365.com",
      pop3: "outlook.office365.com",
    },
    { name: "Yahoo", imap: "imap.mail.yahoo.com", pop3: "pop.mail.yahoo.com" },
    { name: "AOL", imap: "imap.aol.com", pop3: "pop.aol.com" },
    { name: "Zoho", imap: "imap.zoho.com", pop3: "pop.zoho.com" },
    { name: "Custom", imap: "", pop3: "" },
  ];

  useEffect(() => {
    async function fetchEmailConfigs() {
      const response = await fetch("/api/email-config");
      if (response.ok) {
        const data = await response.json();
        setEmailConfigs(data.emailConfigs);
      }
    }
    fetchEmailConfigs();
  }, []);

  async function saveConfiguration() {
    const response = await fetch("/api/email-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailAddress,
        connectionType,
        username,
        password,
        host,
      }),
    });

    if (response.ok) {
      alert("✅ Configuration saved successfully!");
      const newConfig = await response.json();
      setEmailConfigs([...emailConfigs, newConfig.emailConfig]);
    } else {
      alert("❌ Failed to save configuration.");
    }
  }

  async function fetchEmails() {
    await fetch("/api/email-ingestion", { method: "GET" });
    alert("📩 Email ingestion started!");

    // Redirect to Email Ingestion Page
    setTimeout(() => {
      router.push("/email-ingestion");
    }, 1000);
  }

  // Function to update host based on provider and connection type
  const updateHost = (providerName, connType) => {
    const provider = emailProviders.find((p) => p.name === providerName);
    if (provider) {
      setHost(connType === "IMAP" ? provider.imap : provider.pop3);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          📧 Email Configuration
        </h1>

        {/* Existing Configurations */}
        {emailConfigs.length > 0 ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              ⚙️ Existing Configurations
            </h2>
            <ul className="mt-2 space-y-2">
              {emailConfigs.map((config) => (
                <li key={config.id} className="bg-gray-100 p-2 rounded-md">
                  <strong>{config.emailAddress}</strong> (
                  {config.connectionType}) - {config.host}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No configurations found. Add a new one below.
          </p>
        )}

        {/* Email Configuration Form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveConfiguration();
          }}>
          <div>
            <label className="block text-sm font-medium">
              📧 Email Address:
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">👤 Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">🔒 Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Dropdown for Connection Type */}
          <div>
            <label className="block text-sm font-medium">
              🔗 Connection Type:
            </label>
            <select
              value={connectionType}
              onChange={(e) => {
                setConnectionType(e.target.value);
                updateHost(selectedProvider, e.target.value); // Update host when changing connection type
              }}
              className="w-full p-2 border rounded-md">
              <option value="IMAP">IMAP</option>
              <option value="POP3">POP3</option>
            </select>
          </div>

          {/* Dropdown for Email Provider */}
          <div>
            <label className="block text-sm font-medium">
              📨 Email Provider:
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                updateHost(e.target.value, connectionType); // Update host when changing provider
              }}
              className="w-full p-2 border rounded-md">
              {emailProviders.map((provider) => (
                <option key={provider.name} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAP/POP3 Host Field */}
          <div>
            <label className="block text-sm font-medium">
              📡 IMAP/POP3 Host:
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            💾 Save Configuration
          </button>
        </form>

        <button
          onClick={fetchEmails}
          className="w-full mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
          📩 Check Inbox for PDFs
        </button>
      </div>
    </div>
  );
}
