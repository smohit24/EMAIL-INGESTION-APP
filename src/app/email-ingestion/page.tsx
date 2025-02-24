"use client";

import { useState } from "react";

export default function EmailIngestionPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/email-ingestion");
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        // Automatically download PDFs if any exist
        if (data.pdfFiles && data.pdfFiles.length > 0) {
          data.pdfFiles.forEach((fileName: string) => {
            const fileUrl = `/pdfs/${fileName}`;
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
        } else {
          setMessage("Emails fetched but no PDFs found.");
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to fetch emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-xl font-bold mb-4 text-blue-600">
          📩 Email Ingestion
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={fetchEmails}
          disabled={loading}>
          {loading ? "Checking..." : "Check Inbox for PDFs"}
        </button>

        {message && (
          <p className="mt-4 p-3 bg-green-200 text-green-700 rounded">
            ✅ {message}
          </p>
        )}
        {error && (
          <p className="mt-4 p-3 bg-red-200 text-red-700 rounded">❌ {error}</p>
        )}
      </div>
    </div>
  );
}
