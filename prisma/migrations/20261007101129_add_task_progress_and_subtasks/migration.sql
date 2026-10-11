-- CreateTable
CREATE TABLE "LearningSubtask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearningSubtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "LearningTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LearningTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "deadline" DATETIME,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearningTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LearningTask" ("createdAt", "deadline", "description", "id", "priority", "status", "title", "type", "updatedAt", "userId") SELECT "createdAt", "deadline", "description", "id", "priority", "status", "title", "type", "updatedAt", "userId" FROM "LearningTask";
DROP TABLE "LearningTask";
ALTER TABLE "new_LearningTask" RENAME TO "LearningTask";
CREATE INDEX "LearningTask_userId_status_idx" ON "LearningTask"("userId", "status");
CREATE INDEX "LearningTask_userId_deadline_idx" ON "LearningTask"("userId", "deadline");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LearningSubtask_taskId_sortOrder_idx" ON "LearningSubtask"("taskId", "sortOrder");
