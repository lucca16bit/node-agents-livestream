-- CreateTable
CREATE TABLE "audio_chunks" (
    "id" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "audio_chunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audio_chunks" ADD CONSTRAINT "audio_chunks_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
