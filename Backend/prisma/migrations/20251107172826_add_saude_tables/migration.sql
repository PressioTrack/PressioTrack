/*
  Warnings:

  - Added the required column `idade` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medicoes` ADD COLUMN `observacao` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `idade` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `dados_saude` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `pressaoSistolicaNormal` INTEGER NULL DEFAULT 120,
    `pressaoDiastolicaNormal` INTEGER NULL DEFAULT 80,
    `sistolicaMin` INTEGER NULL,
    `sistolicaMax` INTEGER NULL,
    `diastolicaMin` INTEGER NULL,
    `diastolicaMax` INTEGER NULL,
    `dataDefinicao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `dados_saude_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dados_saude` ADD CONSTRAINT `dados_saude_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
