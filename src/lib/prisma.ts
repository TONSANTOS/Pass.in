import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ['query'], // cada query que for feita ao banco de dados, ele vai fazer um log dessa query sendo feita
})