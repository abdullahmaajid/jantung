// =============================================================
// src/lib/mock-data.ts
//
// Data tiruan (mock) untuk development tanpa PostgreSQL.
// Saat database sudah siap, ganti dengan query Prisma asli.
// =============================================================

import { AnatomyPart, ClinicalCase, ConductionNode, Module, ModuleId } from "@/core/types";

// ─────────────────────────────────────────────
// DATA ANATOMI JANTUNG
// ─────────────────────────────────────────────
export const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: "aorta",
    label: "Aorta",
    description: "Pembuluh darah terbesar yang membawa darah kaya oksigen dari ventrikel kiri ke seluruh tubuh. Diameter mencapai 2-3 cm pada orang dewasa.",
    position: [0.2, 1, 0.7],
    color: "#c0392b",
  },
  {
    id: "pulmonary-artery",
    label: "Arteri Pulmonalis",
    description: "Membawa darah miskin oksigen dari ventrikel kanan ke paru-paru untuk proses oksigenasi (pertukaran CO₂ dan O₂).",
    position: [0.2, 0.5, 0.7],
    color: "#2980b9",
  },
  {
    id: "left-ventricle",
    label: "Ventrikel Kiri",
    description: "Bilik jantung paling kuat. Memompa darah ke seluruh tubuh melawan tekanan sistemik tinggi. Dinding ototnya 3x lebih tebal dari ventrikel kanan.",
    position: [1, -1, 0.99],
    color: "#8b1a1a",
  },
  {
    id: "right-ventricle",
    label: "Ventrikel Kanan",
    description: "Memompa darah ke paru-paru melalui arteri pulmonalis. Tekanan kerjanya lebih rendah dari ventrikel kiri (sirkulasi pulmonal).",
    position: [-0.78, -1, 0.990],
    color: "#1a3a8b",
  },
  {
    id: "mitral-valve",
    label: "Katup Mitral",
    description: "Katup bikuspid (2 daun) antara atrium kiri dan ventrikel kiri. Mencegah aliran balik darah saat ventrikel berkontraksi.",
    position: [0.4, -0.3,  0.990],
    color: "#c9a84c",
  },
  {
    id: "left-atrium",
    label: "Atrium Kiri",
    description: "Menerima darah kaya oksigen dari paru-paru melalui 4 vena pulmonalis. Tekanan di sini lebih tinggi dari atrium kanan.",
    position: [0.68, 0.2, 0.59],
    color: "#922b21",
  },
  {
    id: "right-atrium",
    label: "Atrium Kanan",
    description: "Menerima darah miskin oksigen dari seluruh tubuh via vena cava superior dan inferior. Di sini terdapat SA Node (pacemaker alami).",
    position: [-0.78, 0.5, 0.1],
    color: "#1f618d",
  },
  {
    id: "tricuspid-valve",
    label: "Katup Trikuspid",
    description: "Katup 3 daun antara atrium kanan dan ventrikel kanan. Disfungsi katup ini menyebabkan regurgitasi trikuspid.",
    position: [-0.78, 0, 0.990],
    color: "#d4ac0d",
  },
];

// ─────────────────────────────────────────────
// DATA NODE KONDUKSI LISTRIK
// ─────────────────────────────────────────────
export const CONDUCTION_NODES: ConductionNode[] = [
  { id: "sa-node", name: "SA Node", position: [0.5, 0.9, 0], delay: 0, color: "#f39c12" },
  { id: "av-node", name: "AV Node", position: [0.1, 0.3, 0], delay: 600, color: "#e67e22" },
  { id: "bundle-of-his", name: "Bundle of His", position: [0.05, 0.0, 0], delay: 900, color: "#e74c3c" },
  { id: "left-bundle", name: "Left Bundle Branch", position: [-0.4, -0.3, 0], delay: 1100, color: "#c0392b" },
  { id: "right-bundle", name: "Right Bundle Branch", position: [0.4, -0.3, 0], delay: 1100, color: "#c0392b" },
  { id: "purkinje", name: "Serabut Purkinje", position: [0, -0.9, 0], delay: 1300, color: "#922b21" },
];

// ─────────────────────────────────────────────
// DATA KASUS KLINIS (Simulasi Database)
// ─────────────────────────────────────────────
export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: "case-001",
    title: "Stenosis Katup Mitral",
    description: "Pasien wanita 45 tahun dengan sesak napas progresif terutama saat aktivitas, riwayat demam rematik 20 tahun lalu. Pada auskultasi terdengar murmur diastolik low-pitched di apeks jantung dengan opening snap.",
    audioUrl: "/models/SUARAJANTUNG.mp3",
    correctAnsw: "Mitral Stenosis",
    options: ["Mitral Stenosis", "Aortic Regurgitasi", "Ventrikel Septal Defek", "Hipertensi Pulmonal"],
  },
  {
    id: "case-002",
    title: "Regurgitasi Aorta",
    description: "Pasien pria 60 tahun dengan nyeri dada dan palpitasi. Tekanan darah 160/60 mmHg (pulse pressure lebar). Auskultasi: murmur dekresendo diastolik di linea parasternalis kiri.",
    audioUrl: "/models/SUARAJANTUNG.mp3",
    correctAnsw: "Regurgitasi Aorta",
    options: ["Mitral Stenosis", "Regurgitasi Aorta", "Stenosis Aorta", "Patent Ductus Arteriosus"],
  },
  {
    id: "case-003",
    title: "Ventrikel Septal Defek (VSD)",
    description: "Bayi 3 bulan dengan berat badan tidak naik, sulit menyusu, dan sering terlihat kebiruan (sianosis ringan). Pada pemeriksaan: murmur holosistolik kasar di LLSB (Lower Left Sternal Border).",
    audioUrl: "/models/SUARAJANTUNG.mp3",
    correctAnsw: "Ventrikel Septal Defek",
    options: ["Atrial Septal Defek", "Ventrikel Septal Defek", "Tetralogy of Fallot", "Patent Ductus Arteriosus"],
  },
];

// ─────────────────────────────────────────────
// KONFIGURASI MODUL NAVIGASI
// ─────────────────────────────────────────────
export const MODULES: Module[] = [
  {
    id: ModuleId.Anatomy,
    title: "Anatomi Struktural",
    subtitle: "Eksplorasi 3D Interaktif",
    href: "/anatomy",
    icon: "🫀",
    color: "#8b1a1a",
  },
  {
    id: ModuleId.Hemodynamic,
    title: "Hemodinamik",
    subtitle: "Simulasi Aliran Darah",
    href: "/hemodynamic",
    icon: "🩸",
    color: "#1a3a8b",
  },
  {
    id: ModuleId.Conduction,
    title: "Sistem Konduksi",
    subtitle: "Jalur Listrik Jantung",
    href: "/conduction",
    icon: "⚡",
    color: "#7d3c98",
  },
  {
    id: ModuleId.Cases,
    title: "Kasus Klinis",
    subtitle: "Simulasi Diagnosa",
    href: "/cases",
    icon: "🩺",
    color: "#1a5a3a",
  },
  {
    id: ModuleId.Resources,
    title: "Sumber Daya",
    subtitle: "Jurnal & Referensi",
    href: "/resources",
    icon: "📚",
    color: "#5a4a1a",
  },
];
