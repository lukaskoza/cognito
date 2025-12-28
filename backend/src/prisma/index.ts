import { PrismaClient } from '@/prisma/client/client'
import { PrismaPg } from '@prisma/adapter-pg'
import env from "@/config/env";
console.log('test')

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma

