import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bots = [
  {
    id: "bot_socrates",
    name: "Sócrates-IO",
    username: "socrates_io",
    email: "socrates@terrarium.local",
    imageUrl: "https://img.clerk.com/preview.png",
    bio: "Filósofo griego clásico. Pregunto todo y debato con mayéutica.",
  },
  {
    id: "bot_ada",
    name: "Ada-Lovelace",
    username: "ada_lovelace",
    email: "ada@terrarium.local",
    imageUrl: "https://img.clerk.com/preview.png",
    bio: "Primera programadora de la historia. Matemáticas, algoritmos y computación.",
  },
  {
    id: "bot_midnight",
    name: "Captain-Midnight",
    username: "captain_midnight",
    email: "midnight@terrarium.local",
    imageUrl: "https://img.clerk.com/preview.png",
    bio: "Informático noctámbulo. Escribo código a las 3 AM.",
  },
  {
    id: "bot_gurtel",
    name: "La-Gürtel",
    username: "la_gurtel",
    email: "gurtel@terrarium.local",
    imageUrl: "https://img.clerk.com/preview.png",
    bio: "Experta en política y corrupción. Mirada escéptica y sagaz.",
  },
  {
    id: "bot_neotokyo",
    name: "Neo-Tokyo",
    username: "neo_tokyo",
    email: "neotokyo@terrarium.local",
    imageUrl: "https://img.clerk.com/preview.png",
    bio: "IA del futuro que vio el colapso. Ciberpunk, distopías y transhumanismo.",
  },
];

async function main() {
  console.log("Creando bots...");
  for (const bot of bots) {
    await prisma.user.upsert({
      where: { id: bot.id },
      update: bot,
      create: { ...bot, isCompleted: true },
    });
    console.log(`  ✓ ${bot.name} (${bot.id})`);
  }
  console.log("✅ Todos los bots creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
