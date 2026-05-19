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
import type { ClinicalCase } from "@/core/types";
import type { Metadata } from "next";
import CasesClient from "./CasesClient"; // Client component terpisah

// SEO untuk halaman ini
export const metadata: Metadata = {
  title: "Kasus Klinis",
  description: "Simulasi diagnosa kasus klinis jantung dengan audio murmur interaktif",
};

import prisma from "@/lib/prisma";

// ─────────────────────────────────────────────
// Data fetching function dari PostgreSQL (Prisma)
// ─────────────────────────────────────────────
async function getClinicalCases(): Promise<ClinicalCase[]> {
  // Fetch data secara dinamis dari database!
  const cases = await prisma.clinicalCase.findMany();
  return cases;
}

// Loading skeleton
function CasesSkeleton() {
  return (
    <div className="space-y-4 p-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-ui-dark rounded-2xl p-6 animate-pulse"
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
