/*
  Warnings:

  - Added the required column `embeddings` to the `audio_chunks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "audio_chunks" ADD COLUMN     "embeddings" vector(768) NOT NULL;
