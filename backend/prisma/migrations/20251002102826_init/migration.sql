/*
  Warnings:

  - Made the column `categoryId` on table `sweet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."sweet" DROP CONSTRAINT "sweet_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."sweet" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."sweet" ADD CONSTRAINT "sweet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
