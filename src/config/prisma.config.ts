import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // optional for debugging
});

export const connectPrisma = async (): Promise<void> => {
  prisma.$connect()
  .then(() => console.log("✅ SQL DB Connected"))
  .catch(err => console.error("❌ SQL DB Error:", err));
}


export default prisma;
