-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `associacaoToken` VARCHAR(191) NULL,
    ADD COLUMN `associacaoTokenExpiry` DATETIME(3) NULL;
