-- AlterTable
ALTER TABLE `user` MODIFY `profile_image` VARCHAR(191) NOT NULL DEFAULT '/profile/default.webp';

-- CreateTable
CREATE TABLE `refresh_token_black_list` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
