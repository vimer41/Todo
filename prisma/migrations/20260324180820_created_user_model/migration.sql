-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(15),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
