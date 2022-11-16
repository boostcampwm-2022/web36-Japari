-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `profile_image` VARCHAR(191) NOT NULL DEFAULT '/public/profile/default.jpg',

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game` (
    `game_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `minimum_people` INTEGER NOT NULL,

    PRIMARY KEY (`game_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend` (
    `from_user_id` INTEGER NOT NULL,
    `to_user_id` INTEGER NOT NULL,

    PRIMARY KEY (`from_user_id`, `to_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
