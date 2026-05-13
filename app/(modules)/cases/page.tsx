// =============================================================
// app/(modules)/cases/page.tsx
//
// MODUL 4: Kasus Klinis
// INI adalah Server Component (tidak ada "use client")!
// Data di-fetch dari database PostgreSQL di SERVER.
//
// TYPESCRIPT: async Server Component adalah fitur Next.js 13+
// Fungsi async bisa langsung di dalam komponen Server
// =============================================================

import { Suspense } from "react";
import { CLINICAL_CASES } from "@/lib/mock-data"; // Mock data (ganti dengan Prisma saat DB siap)
import type { ClinicalCase } from "@/core/types";
import type { Metadata } from "next";
import CasesClient from "./CasesClient"; // Client component terpisah

// SEO untuk halaman ini
export const metadata: Metadata = {
  title: "Kasus Klinis",
  description: "Simulasi diagnosa kasus klinis jantung dengan audio murmur interaktif",
};

// ─────────────────────────────────────────────
// Data fetching function (murni, terisolasi di layer lib/)
// Ganti dengan Prisma saat database siap:
//
// import prisma from "@/lib/prisma";
// async function getCases(): Promise<ClinicalCase[]> {
//   return await prisma.clinicalCase.findMany();
// }
// ─────────────────────────────────────────────
async function getClinicalCases(): Promise<ClinicalCase[]> {
  // Simulasi async fetch (seperti database query)
  await new Promise((resolve) => setTimeout(resolve, 100));
  return CLINICAL_CASES;
}

// Loading skeleton
function CasesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-panel p-6 animate-pulse"
          style={{ height: "180px" }}
        />
      ))}
    </div>
  );
}

// Server Component utama
export default async function CasesPage() {
  // Fetch data di server (sebelum dikirim ke client)
  const cases = await getClinicalCases();

  return (
    <Suspense fallback={<CasesSkeleton />}>
      {/* CasesClient adalah Client Component yang handle interaksi */}
      <CasesClient initialCases={cases} />
    </Suspense>
  );
}
