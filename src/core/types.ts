// =============================================================
// src/core/types.ts
// 
// PENJELASAN TYPESCRIPT BEST PRACTICE:
// File ini adalah "kamus" tipe data untuk seluruh aplikasi.
// Dengan mendefinisikan tipe di satu tempat (Single Source of Truth),
// seluruh kode akan konsisten dan TypeScript bisa mendeteksi error.
// =============================================================

// ─────────────────────────────────────────────
// ENUM: Nilai tetap yang sudah ditentukan
// Gunakan enum saat ada pilihan terbatas yang fixed
// ─────────────────────────────────────────────
export enum HeartPhase {
  Systolic = "systolic",   // Fase jantung memompa (kontraksi)
  Diastolic = "diastolic", // Fase jantung mengisi (relaksasi)
}

export enum ModuleId {
  Anatomy = "anatomy",
  Hemodynamic = "hemodynamic",
  Conduction = "conduction",
  Cases = "cases",
  Resources = "resources",
}

// ─────────────────────────────────────────────
// INTERFACE: "Kontrak" bentuk sebuah objek
// Gunakan interface untuk mendefinisikan struktur data
// ─────────────────────────────────────────────

// Tipe data untuk satu bagian anatomi jantung
export interface AnatomyPart {
  id: string;              // Tipe "string" = teks biasa
  label: string;           // Nama label (mis: "Aorta")
  description: string;     // Deskripsi panjang
  position: [number, number, number]; // Array tepat 3 angka (x, y, z)
  color: string;           // Warna hex (mis: "#ff0000")
}

// Tipe data kasus klinis (sesuai model Prisma)
export interface ClinicalCase {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  correctAnsw: string;
  // "?" artinya opsional - boleh ada boleh tidak
  options?: string[];
}

// Tipe data untuk progres pengguna
export interface UserProgress {
  id: string;
  userId: string;
  completed: boolean;
  module: ModuleId;
  score?: number;          // number | undefined (opsional)
  updatedAt: Date;
}

// Tipe data untuk modul navigasi
export interface Module {
  id: ModuleId;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

// Tipe untuk node konduksi listrik jantung
export interface ConductionNode {
  id: string;
  name: string;
  position: [number, number, number];
  delay: number;           // Delay animasi dalam milidetik
  color: string;
}

// ─────────────────────────────────────────────
// TYPE ALIAS: Alias untuk tipe yang kompleks
// Gunakan "type" untuk union types atau tipe sederhana
// ─────────────────────────────────────────────

// Union type: nilai bisa salah satu dari opsi ini
export type LayerVisibility = "all" | "muscle" | "vessels" | "chambers";

// Props type untuk React component - ini SANGAT penting di TypeScript!
// Selalu buat Props type untuk setiap komponen React
export type HeartCanvasProps = {
  phase: HeartPhase;
  showLayers: LayerVisibility;
  onPartClick?: (part: AnatomyPart) => void; // "?" = prop opsional
};

export type AnnotationProps = {
  part: AnatomyPart;
  isSelected: boolean;
  onClick: () => void;    // Fungsi tanpa parameter, tidak return apapun
};

// Return type untuk API responses
export type ApiResponse<T> = {
  data: T;                 // "T" adalah Generic - bisa diisi tipe apapun
  success: boolean;
  message?: string;
};

// Contoh penggunaan Generic:
// ApiResponse<ClinicalCase[]>  → data berisi array ClinicalCase
// ApiResponse<UserProgress>    → data berisi satu UserProgress
