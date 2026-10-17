import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local", quiet: true });

const databaseUrl = new URL(env("DATABASE_URL"));
databaseUrl.searchParams.set("schema", "private_app");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl.toString() },
});
