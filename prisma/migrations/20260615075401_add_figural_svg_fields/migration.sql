-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "optionImageSvg" JSONB,
ADD COLUMN     "questionImageSvg" TEXT,
ADD COLUMN     "questionType" TEXT NOT NULL DEFAULT 'text';
