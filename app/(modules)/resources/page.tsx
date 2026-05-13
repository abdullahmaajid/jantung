"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Metadata } from "next";

type Resource = {
  id: string;
  category: string;
  title: string;
  source: string;
  url: string;
  description: string;
  tags: string[];
  type: "journal" | "book" | "atlas" | "video";
};

const RESOURCES: Resource[] = [
  {
    id: "r1",
    category: "Jurnal Medis",
    title: "Anatomy of the Human Heart: A Comprehensive Review",
    source: "PubMed / NCBI",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    description: "Tinjauan komprehensif anatomi jantung manusia mencakup struktur makroskopik, vaskularisasi, dan variasi anatomis.",
    tags: ["Anatomy", "Cardiology", "Review"],
    type: "journal",
  },
  {
    id: "r2",
    category: "Jurnal Medis",
    title: "Hemodynamics and Cardiac Physiology",
    source: "PubMed / NCBI",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=hemodynamics+cardiac+physiology",
    description: "Konsep hemodinamik: preload, afterload, kontraktilitas, dan siklus jantung sistolik-diastolik.",
    tags: ["Hemodynamics", "Physiology", "Cardiac Cycle"],
    type: "journal",
  },
  {
    id: "r3",
    category: "Jurnal Medis",
    title: "Cardiac Conduction System: A Review",
    source: "PubMed / NCBI",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=cardiac+conduction+system",
    description: "Sistem konduksi listrik jantung: SA Node, AV Node, Bundle of His, dan Serabut Purkinje.",
    tags: ["Conduction", "SA Node", "Electrophysiology"],
    type: "journal",
  },
  {
    id: "r4",
    category: "Atlas Anatomi",
    title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
    source: "Elsevier",
    url: "https://www.clinicalkey.com/nursing/dura/browse/bookChapter/3-s2.0-C20090407042",
    description: "Referensi atlas anatomi standar dunia. Bab kardiovaskular memuat ilustrasi detail jantung dan pembuluh darah besar.",
    tags: ["Atlas", "Clinical Anatomy", "Standard Reference"],
    type: "atlas",
  },
  {
    id: "r5",
    category: "Atlas Anatomi",
    title: "Netter's Atlas of Human Anatomy",
    source: "Elsevier",
    url: "https://www.netterimages.com/",
    description: "Atlas ilustrasi medis paling ikonik. Ilustrasi jantung Frank Netter diakui sebagai standar pendidikan kedokteran global.",
    tags: ["Atlas", "Illustration", "Netter"],
    type: "atlas",
  },
  {
    id: "r6",
    category: "Sumber Daya Digital",
    title: "Human Heart Anatomy 3D Model (Sketchfab)",
    source: "Sketchfab",
    url: "https://sketchfab.com/search?q=human+heart+anatomy&sort_by=-pertinence",
    description: "Koleksi model 3D jantung gratis format .glb/.gltf. Gunakan keyword: 'human heart anatomy free' atau 'low poly beating heart gltf'.",
    tags: ["3D Model", "Free", "GLTF"],
    type: "video",
  },
  {
    id: "r7",
    category: "Sumber Daya Digital",
    title: "Heart Sounds & Murmurs (Freesound.org)",
    source: "Freesound.org",
    url: "https://freesound.org/search/?q=heart+murmur",
    description: "Basis data suara medis open-source. Tersedia normal heart sounds (lub-dub) dan berbagai murmur patologis.",
    tags: ["Audio", "Murmur", "Auscultation"],
    type: "video",
  },
  {
    id: "r8",
    category: "Jurnal Medis",
    title: "Heart Murmur: Clinical Evaluation and Management",
    source: "PubMed / NCBI",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=heart+murmur+clinical+evaluation",
    description: "Panduan evaluasi klinis murmur jantung: teknik auskultasi, grading, dan differensial diagnosis.",
    tags: ["Murmur", "Auscultation", "Clinical"],
    type: "journal",
  },
];

const TYPE_ICONS: Record<Resource["type"], string> = {
  journal: "📄",
  book: "📚",
  atlas: "🗺️",
  video: "🔗",
};

const TYPE_COLORS: Record<Resource["type"], string> = {
  journal: "#3182ce",
  book: "#805ad5",
  atlas: "#38a169",
  video: "#dd6b20",
};

function groupByCategory(resources: Resource[]): Record<string, Resource[]> {
  return resources.reduce<Record<string, Resource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});
}

export default function ResourcesPage() {
  const grouped = groupByCategory(RESOURCES);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 flex-shrink-0 sticky top-0 z-10">
        <div>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Modul 05</p>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Sumber Daya & Referensi</h1>
        </div>
        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full border border-slate-200">
          {RESOURCES.length} Referensi
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="p-5 bg-white border border-slate-100 rounded-2xl mb-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-2">Referensi Primer</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Aplikasi ini adalah titik awal. Untuk pemahaman yang lebih mendalam, eksplorasi referensi berikut — jurnal peer-reviewed, atlas anatomi standar, dan sumber daya multimedia terpilih.
            </p>
          </div>

          {/* Resource Groups */}
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-0.5 bg-blue-500 rounded" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{category}</h2>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.map((resource, i) => (
                  <motion.a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: TYPE_COLORS[resource.type] + "12", border: `1px solid ${TYPE_COLORS[resource.type]}30` }}
                    >
                      {TYPE_ICONS[resource.type]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: TYPE_COLORS[resource.type] + "12", color: TYPE_COLORS[resource.type] }}
                        >
                          {resource.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1">↗</div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}

          <div className="h-px bg-slate-200 my-6" />
          <p className="text-[11px] text-center text-slate-400">
            Semua tautan menuju sumber eksternal. CardioLearn tidak berafiliasi dengan platform tersebut.
          </p>
        </div>
      </div>
    </div>
  );
}
