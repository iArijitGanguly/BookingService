/*
  Warnings:

  - You are about to drop the column `idemKey` on the `idempotency_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idem_key]` on the table `idempotency_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idem_key` to the `idempotency_keys` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `idempotency_keys_idemKey_key` ON `idempotency_keys`;

-- AlterTable
ALTER TABLE `idempotency_keys` DROP COLUMN `idemKey`,
    ADD COLUMN `idem_key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idempotency_keys_idem_key_key` ON `idempotency_keys`(`idem_key`);
