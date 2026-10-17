import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    throw new Error("Test invite creation is disabled in production.");
  }

  const { hashInviteCode, requireInviteEnvironment } = await import("../src/lib/invite/code");
  requireInviteEnvironment();

  const databaseUrl = new URL(process.env.DATABASE_URL!);
  const databaseName = decodeURIComponent(databaseUrl.pathname.slice(1));
  if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol) || databaseName !== "mva_dev") {
    throw new Error("Test invite creation requires the mva_dev PostgreSQL database.");
  }

  const { prisma } = await import("../src/lib/prisma");
  const identity = await prisma.$queryRaw<Array<{ database: string }>>`SELECT current_database() AS database`;
  if (identity[0]?.database !== "mva_dev") {
    throw new Error("Connected database is not mva_dev.");
  }

  const codeHash = hashInviteCode("HELLO-TEST");
  const existing = await prisma.inviteAccess.findUnique({
    where: { codeHash },
    select: { id: true, codeType: true, status: true },
  });

  if (existing && existing.codeType !== "TEST") {
    throw new Error("The test code hash belongs to a non-test invite.");
  }

  if (!existing) {
    await prisma.inviteAccess.create({
      data: { codeHash, codeType: "TEST", status: "UNUSED" },
    });
    console.log("Development test invite created.");
  } else if (existing.status !== "UNUSED") {
    await prisma.inviteAccess.update({
      where: { id: existing.id },
      data: {
        status: "UNUSED",
        redeemedAt: null,
        completedAt: null,
        sessionTokenHash: null,
        sessionExpiresAt: null,
        returnCount: 0,
        secondVisitChoice: null,
      },
    });
    console.log("Development test invite reset for reuse.");
  } else {
    console.log("Development test invite already exists; no changes made.");
  }

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Test invite creation failed.");
  process.exitCode = 1;
});
