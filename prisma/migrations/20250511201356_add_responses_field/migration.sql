/*
  Warnings:

  - Added the required column `updatedAt` to the `Checklist` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "fields" TEXT NOT NULL,
    "responses" TEXT,
    "publicToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checklist" ("clientName", "createdAt", "fields", "id", "publicToken", "serviceType", "status", "userId") SELECT "clientName", "createdAt", "fields", "id", "publicToken", "serviceType", "status", "userId" FROM "Checklist";
DROP TABLE "Checklist";
ALTER TABLE "new_Checklist" RENAME TO "Checklist";
PRAGMA foreign_key_check("Checklist");
PRAGMA foreign_keys=ON;
