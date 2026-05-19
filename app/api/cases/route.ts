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
import prisma from "@/lib/prisma";

// GET /api/cases - Ambil semua kasus klinis
export async function GET(request: NextRequest) {
  try {
    const cases = await prisma.clinicalCase.findMany();

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
