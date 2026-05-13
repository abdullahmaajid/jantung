// =============================================================
// app/api/cases/route.ts
//
// API Route untuk data kasus klinis
// Next.js App Router API: gunakan Response object Web standard
//
// TYPESCRIPT:
// "NextRequest" adalah tipe dari Next.js untuk request object
// "Response" adalah Web API standard - tidak perlu import
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { CLINICAL_CASES } from "@/lib/mock-data";

// GET /api/cases - Ambil semua kasus klinis
export async function GET(request: NextRequest) {
  try {
    // Saat database PostgreSQL siap, ganti dengan:
    // import prisma from "@/lib/prisma";
    // const cases = await prisma.clinicalCase.findMany();

    const cases = CLINICAL_CASES;

    return NextResponse.json({
      data: cases,
      success: true,
      message: "Berhasil mengambil data kasus klinis",
    });
  } catch (error) {
    // Error handling - selalu return response yang meaningful
    console.error("[API/cases] Error:", error);
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Gagal mengambil data kasus klinis",
      },
      { status: 500 }
    );
  }
}
