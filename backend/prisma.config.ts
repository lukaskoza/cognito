
import "dotenv/config";
import type { PrismaConfig } from "prisma";

// Setting prisma to whole src folder for module specific models
export default {
    schema: 'src'
  } satisfies PrismaConfig