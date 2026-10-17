-- AlterTable
ALTER TABLE `LearningTask` ADD COLUMN `scheduleDate` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `LearningTask_userId_scheduleDate_idx` ON `LearningTask`(`userId`, `scheduleDate`);
