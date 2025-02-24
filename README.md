# Email Ingestion App

## Overview
This application retrieves emails from configured inboxes (IMAP, POP3, Outlook/Graph API), downloads PDF attachments, and stores metadata in a PostgreSQL database. The UI allows users to configure email accounts, manage settings, and trigger email retrieval.

## Features
- Supports IMAP, POP3, Outlook API for fetching emails.
- Extracts and saves PDF attachments to the `./pdfs/` directory.
- Stores metadata in PostgreSQL using Prisma ORM.
- Next.js UI for managing email configurations.

---

## Project Structure
```
EMAIL-INGESTION-APP/
│── node_modules/
│── pdfs/                  # Stores downloaded PDFs
│── prisma/
│   ├── migrations/        # Prisma migrations
│   ├── schema.prisma      # Database schema
│── public/
│── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── email-config/
│   │   │   │   ├── route.ts  # API to configure email settings
│   │   │   ├── email-ingestion/
│   │   │   │   ├── route.ts  # API to fetch emails & store PDFs
│   │   ├── email-config/
│   │   │   ├── page.tsx      # UI for email configuration
│   │   ├── email-ingestion/
│   │   │   ├── page.tsx      # UI for email ingestion
│   ├── components/
│   │   ├── EmailConfigForm.tsx
│   │   ├── EmailList.tsx
│   ├── scripts/
│   ├── utils/
│   │   ├── emailHandler.ts   # Handles email retrieval & PDF storage
│   │   ├── prismaClient.ts   # Prisma client instance
│── .env
│── .gitignore
│── package.json
│── README.md
```

---

## Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone <https://github.com/smohit24/EMAIL-INGESTION-APP.git>
cd EMAIL-INGESTION-APP
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the project root:
```ini
DATABASE_URL=postgresql://postgres:mohit@24@localhost:5432/email_db
EMAIL_USER=mohit.s1724@gmail.com
EMAIL_PASSWORD=lytc hxih ovnu jamx
EMAIL_HOST=imap.gmail.com
```

### 4️⃣ Run Database Migrations
```bash
npx prisma migrate dev --name init
npx prisma studio
```

### 5️⃣ Start the Development Server
```bash
npm run dev
```

### 6️⃣ Access the UI
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing
### ✅ Verify Email Ingestion
1. Send a test email to your configured email address with a **PDF attachment**.
2. Click the **Check Inbox** button in the UI or wait for automatic polling.
3. Confirm the PDF appears in the `./pdfs/` folder.
4. Check the PostgreSQL database for a new record in the `EmailMetadata` table.

```sql
SELECT * FROM "EmailMetadata";
```

---

## Constraints & Notes
- **Security:** Store email credentials in `.env` or the Prisma database. No encryption is required for this test.
- **Error Handling:** Logs errors for invalid email credentials and attachment issues.
- **UI Simplicity:** Displays configured emails and allows adding/editing. A button triggers inbox checking.

---

### 📜 README:
Include clear setup and run instructions.


