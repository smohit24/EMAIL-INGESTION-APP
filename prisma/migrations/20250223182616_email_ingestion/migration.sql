-- CreateTable
CREATE TABLE "EmailIngestionConfig" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailIngestionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMetadata" (
    "id" SERIAL NOT NULL,
    "emailConfigId" INTEGER NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "attachmentFileName" TEXT NOT NULL,

    CONSTRAINT "EmailMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailIngestionConfig_emailAddress_key" ON "EmailIngestionConfig"("emailAddress");
