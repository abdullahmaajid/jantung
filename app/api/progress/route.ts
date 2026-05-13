// =============================================================
// app/api/progress/route.ts
//
// API Route untuk user progress
// =============================================================

import { NextRequest, NextResponse } from "next/server";

// GET /api/progress?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { data: null, success: false, message: "userId wajib diisi" },
        { status: 400 }
      );
    }

    // Saat DB siap:
    // const progress = await prisma.userProgress.findMany({ where: { userId } });

    // Mock response
    const mockProgress = [
      { module: "anatomy", completed: false, score: null },
      { module: "hemodynamic", completed: false, score: null },
      { module: "conduction", completed: false, score: null },
      { module: "cases", completed: false, score: null },
      { module: "resources", completed: false, score: null },
    ];

    return NextResponse.json({ data: mockProgress, success: true });
  } catch (error) {
    return NextResponse.json(
      { data: null, success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update progress
export async function POST(request: NextRequest) {
  try {
    // Tipe body yang diterima
    const body = await request.json() as {
      userId: string;
      module: string;
      completed: boolean;
      score?: number;
    };

    const { userId, module, completed, score } = body;

    if (!userId || !module) {
      return NextResponse.json(
        { data: null, success: false, message: "userId dan module wajib diisi" },
        { status: 400 }
      );
    }

    // Saat DB siap:
    // const progress = await prisma.userProgress.upsert({
    //   where: { userId },
    //   create: { userId, module, completed, score },
    //   update: { completed, score, updatedAt: new Date() },
    // });

    return NextResponse.json({
      data: { userId, module, completed, score },
      success: true,
      message: "Progres berhasil disimpan",
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
