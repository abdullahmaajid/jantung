// prisma.config.ts
// Prisma v7 memindahkan konfigurasi database ke file ini
// File schema.prisma tidak lagi mendukung url = env("DATABASE_URL")

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
