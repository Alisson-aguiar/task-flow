-- CreateTable
CREATE TABLE "shared_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "sharedBy" TEXT NOT NULL,
    "sharedWith" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'VIEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shared_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "shared_tasks_sharedWith_idx" ON "shared_tasks"("sharedWith");

-- CreateIndex
CREATE INDEX "shared_tasks_sharedBy_idx" ON "shared_tasks"("sharedBy");

-- CreateIndex
CREATE UNIQUE INDEX "shared_tasks_taskId_sharedWith_key" ON "shared_tasks"("taskId", "sharedWith");
