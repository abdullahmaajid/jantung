import prisma from "@/lib/prisma";
import ConductionClient from "./ConductionClient";
import type { ConductionNode } from "@/core/types";

async function getConductionNodes(): Promise<ConductionNode[]> {
  const nodes = await prisma.conductionNode.findMany();
  // Ensure array is sorted according to delays or order needed.
  // We can sort by delay to keep the sequence correct
  nodes.sort((a: any, b: any) => a.delay - b.delay);
  return nodes.map((node: any) => ({
    ...node,
    position: node.position as [number, number, number]
  }));
}

export default async function ConductionPage() {
  const nodes = await getConductionNodes();

  return (
    <ConductionClient conductionNodes={nodes} />
  );
}
