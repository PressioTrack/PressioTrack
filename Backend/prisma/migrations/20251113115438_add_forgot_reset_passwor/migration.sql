/*
  Warnings:

  - You are about to drop the column `diastolicaMax` on the `dados_saude` table. All the data in the column will be lost.
  - You are about to drop the column `diastolicaMin` on the `dados_saude` table. All the data in the column will be lost.
  - You are about to drop the column `sistolicaMax` on the `dados_saude` table. All the data in the column will be lost.
  - You are about to drop the column `sistolicaMin` on the `dados_saude` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dados_saude` DROP COLUMN `diastolicaMax`,
    DROP COLUMN `diastolicaMin`,
    DROP COLUMN `sistolicaMax`,
    DROP COLUMN `sistolicaMin`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
