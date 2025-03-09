-- CreateEnum
CREATE TYPE "AdminClientStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "admin_client_relationships" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "AdminClientStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_client_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_client_relationships_adminId_idx" ON "admin_client_relationships"("adminId");

-- CreateIndex
CREATE INDEX "admin_client_relationships_clientId_idx" ON "admin_client_relationships"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_client_relationships_adminId_clientId_key" ON "admin_client_relationships"("adminId", "clientId");

-- AddForeignKey
ALTER TABLE "admin_client_relationships" ADD CONSTRAINT "admin_client_relationships_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_client_relationships" ADD CONSTRAINT "admin_client_relationships_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
