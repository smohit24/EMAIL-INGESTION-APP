import { simpleParser } from "mailparser";
import imaps from "imap-simple";
import fs from "fs-extra";
import path from "path";
import prisma from "@/utils/prismaClient";
import dotenvSafe from "dotenv-safe";
import { v4 as uuidv4 } from "uuid"; // For unique file names

// Load environment variables and validate required ones
dotenvSafe.config();

const PDF_SAVE_PATH = path.join(process.cwd(), "pdfs");
fs.ensureDirSync(PDF_SAVE_PATH); // Ensure 'pdfs' folder exists

export async function fetchEmailsAndStore() {
  let connection;

  try {
    console.log("📩 Fetching email configurations from the database...");
    const emailConfigs = await prisma.emailIngestionConfig.findMany();

    for (const emailConfig of emailConfigs) {
      console.log(`🔗 Connecting to: ${emailConfig.emailAddress}`);

      connection = await imaps.connect({
        imap: {
          user: emailConfig.username,
          password: emailConfig.password,
          host: emailConfig.host,
          port: 993,
          tls: true,
          authTimeout: 5000,
        },
      });

      await connection.openBox("INBOX");
      const messages = await connection.search(["UNSEEN"], {
        bodies: [""],
        markSeen: true,
        struct: true,
      });

      console.log(
        `📬 Found ${messages.length} new emails for ${emailConfig.emailAddress}`
      );

      for (const message of messages) {
        const parts = imaps.getParts(message.attributes.struct);
        const fullMessage = await connection.getPartData(
          message,
          parts.find(
            (p) => p.type === "text/plain" || p.type === "text/html"
          ) || ""
        );

        const parsed = await simpleParser(fullMessage);
        const pdfAttachments = parsed.attachments.filter(
          (attachment) => attachment.contentType === "application/pdf"
        );

        for (const attachment of pdfAttachments) {
          const uniqueFileName = `${uuidv4().split("-")[0]}-${
            attachment.filename
          }`;
          const filePath = path.join(PDF_SAVE_PATH, uniqueFileName);

          await fs.writeFile(filePath, attachment.content);
          console.log(`✅ Saved PDF: ${uniqueFileName}`);

          await prisma.emailMetadata.create({
            data: {
              emailConfigId: emailConfig.id,
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

      connection.end();
      console.log("📭 Connection closed.");
    }
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
