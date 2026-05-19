import prisma from "@/lib/prisma";
import AnatomyClient from "./AnatomyClient";
import type { AnatomyPart } from "@/core/types";

async function getAnatomyParts(): Promise<AnatomyPart[]> {
  const parts = await prisma.anatomyPart.findMany();
  return parts.map((part: any) => ({
    ...part,
    position: part.position as [number, number, number]
  }));
}

export default async function AnatomyPage() {
  const anatomyParts = await getAnatomyParts();

  return (
    <AnatomyClient anatomyParts={anatomyParts} />
  );
}
