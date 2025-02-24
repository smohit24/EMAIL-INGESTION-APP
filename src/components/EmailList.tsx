"use client";

import { useEffect, useState } from "react";

interface EmailMetadata {
  id: number;
  fromAddress: string;
  dateReceived: string;
  subject: string;
  attachmentFileName: string;
}

export default function EmailList() {
  const [emails, setEmails] = useState<EmailMetadata[]>([]);

  useEffect(() => {
    async function fetchEmails() {
      const response = await fetch("/api/email-metadata");
      const data = await response.json();
      setEmails(data);
    }
    fetchEmails();
  }, []);

  return (
    <div>
      <h2>Stored Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>
            <strong>From:</strong> {email.fromAddress} <br />
            <strong>Subject:</strong> {email.subject} <br />
            <strong>Date:</strong>{" "}
            {new Date(email.dateReceived).toLocaleString()} <br />
            <strong>Attachment:</strong> {email.attachmentFileName}
          </li>
        ))}
      </ul>
    </div>
  );
}
