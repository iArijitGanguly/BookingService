/*
  Warnings:

  - You are about to drop the column `key` on the `idempotency_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idemKey]` on the table `idempotency_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idemKey` to the `idempotency_keys` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `idempotency_keys_key_key` ON `idempotency_keys`;

-- AlterTable
ALTER TABLE `idempotency_keys` DROP COLUMN `key`,
    ADD COLUMN `idemKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idempotency_keys_idemKey_key` ON `idempotency_keys`(`idemKey`);
