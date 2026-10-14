-- Initial MySQL schema.

CREATE TABLE `User` (
    `id` VARCHAR(30) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Profile` (
    `id` VARCHAR(30) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `realName` VARCHAR(64) NULL,
    `major` VARCHAR(64) NOT NULL DEFAULT '人工智能',
    `grade` VARCHAR(32) NULL,
    `school` VARCHAR(191) NULL,
    `skills` TEXT NULL,
    `interests` TEXT NULL,
    `bio` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CareerPlan` (
    `id` VARCHAR(30) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `targetDirection` VARCHAR(191) NOT NULL,
    `targetPosition` VARCHAR(191) NOT NULL,
    `targetCity` VARCHAR(191) NULL,
    `targetDate` DATETIME(3) NULL,
    `skillFoundation` TEXT NULL,
    `strengths` TEXT NULL,
    `weaknesses` TEXT NULL,
    `planContent` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `CareerPlan_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `LearningTask` (
    `id` VARCHAR(30) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('COURSE', 'PROJECT', 'COMPETITION', 'JOB_PREP', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('TODO', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'TODO',
    `deadline` DATETIME(3) NULL,
    `description` TEXT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `LearningTask_userId_status_idx`(`userId`, `status`),
    INDEX `LearningTask_userId_deadline_idx`(`userId`, `deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `LearningSubtask` (
    `id` VARCHAR(30) NOT NULL,
    `taskId` VARCHAR(30) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `LearningSubtask_taskId_sortOrder_idx`(`taskId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CareerPath` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `skills` TEXT NOT NULL,
    `courses` TEXT NOT NULL,
    `projects` TEXT NOT NULL,
    `prospect` TEXT NOT NULL,
    `tags` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `CareerPath_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CareerPlan` ADD CONSTRAINT `CareerPlan_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `LearningTask` ADD CONSTRAINT `LearningTask_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `LearningSubtask` ADD CONSTRAINT `LearningSubtask_taskId_fkey`
  FOREIGN KEY (`taskId`) REFERENCES `LearningTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
