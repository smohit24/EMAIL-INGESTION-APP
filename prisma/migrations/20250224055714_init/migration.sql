/*
  Warnings:

  - Added the required column `filePath` to the `EmailMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailMetadata" ADD COLUMN     "filePath" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EmailMetadata" ADD CONSTRAINT "EmailMetadata_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailIngestionConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
