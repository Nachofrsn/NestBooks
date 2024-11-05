-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "rating" TEXT,
    "cover_i" TEXT,
    "genres" TEXT,
    "pages" TEXT,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Books" ("authorId", "cover_i", "description", "genres", "id", "pages", "rating", "title") SELECT "authorId", "cover_i", "description", "genres", "id", "pages", "rating", "title" FROM "Books";
DROP TABLE "Books";
ALTER TABLE "new_Books" RENAME TO "Books";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
