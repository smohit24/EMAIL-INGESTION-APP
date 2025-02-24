import { NextResponse } from "next/server";
import { simpleParser } from "mailparser";
import imaps from "imap-simple";
import fs from "fs-extra";
import path from "path";
import prisma from "@/utils/prismaClient";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const EMAIL_CONFIG = {
  user: process.env.EMAIL_USER || "",
  password: process.env.EMAIL_PASSWORD || "",
  host: process.env.EMAIL_HOST || "",
  port: 993,
  tls: true,
};

const PDF_SAVE_PATH = path.join(process.cwd(), "pdfs");

// Ensure 'pdfs' folder exists
fs.ensureDirSync(PDF_SAVE_PATH);

export async function GET() {
  let connection;
  try {
    console.log("📩 Connecting to email...");

    // Check if credentials are properly set
    if (!EMAIL_CONFIG.user || !EMAIL_CONFIG.password || !EMAIL_CONFIG.host) {
      throw new Error("❌ Missing email credentials in .env");
    }

    connection = await imaps.connect({
      imap: { ...EMAIL_CONFIG, authTimeout: 5000 },
    });

    console.log("✅ Successfully connected to email server.");

    await connection.openBox("INBOX");

    // Fetch unread emails
    const messages = await connection.search(["UNSEEN"], {
      bodies: [""],
      markSeen: true,
      struct: true,
    });

    console.log(`📬 Found ${messages.length} new emails.`);

    for (const message of messages) {
      const parts = imaps.getParts(message.attributes.struct);

      const fullMessage = await connection.getPartData(
        message,
        parts.find((p) => p.type === "text/plain" || p.type === "text/html") ||
          ""
      );

      const parsed = await simpleParser(fullMessage);

      if (parsed.attachments.length > 0) {
        for (const attachment of parsed.attachments) {
          if (attachment.contentType === "application/pdf") {
            // Generate unique file name to avoid duplicates
            const uniqueFileName = `${Date.now()}-${attachment.filename}`;
            const filePath = path.join(PDF_SAVE_PATH, uniqueFileName);

            await fs.writeFile(filePath, attachment.content);
            console.log(`✅ Saved PDF: ${uniqueFileName}`);

            // Store metadata in the database
            await prisma.emailMetadata.create({
              data: {
                fromAddress: parsed.from?.text || "Unknown",
                subject: parsed.subject || "No Subject",
                dateReceived: parsed.date || new Date(),
                attachmentFileName: uniqueFileName,
                filePath,
              },
            });

            console.log("📝 Metadata saved to database.");
          }
        }
      }
    }

    connection.end();
    return NextResponse.json({ message: "Emails fetched and PDFs saved!" });
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.end();
      console.log("📭 Connection closed.");
    }
  }
}
