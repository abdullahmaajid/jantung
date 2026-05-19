"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, BookOpen, Map, Link as LinkIcon, ExternalLink } from "lucide-react";

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

const TYPE_ICONS: Record<Resource["type"], React.ReactNode> = {
  journal: <FileText size={18} strokeWidth={2} />,
  book: <BookOpen size={18} strokeWidth={2} />,
  atlas: <Map size={18} strokeWidth={2} />,
  video: <LinkIcon size={18} strokeWidth={2} />,
};

const TYPE_COLORS: Record<Resource["type"], string> = {
  journal: "var(--color-accent-secondary)",
  book: "var(--color-accent-secondary)",
  atlas: "var(--color-accent-primary-light)",
  video: "var(--text-secondary)",
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
    <div className="flex flex-col h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 sticky top-0 z-10">
        <div>
          <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 05</p>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">Sumber Daya & Referensi</h1>
        </div>
        <span className="px-3 py-1.5 bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] font-bold uppercase rounded-full border border-[var(--border-light)]">
          {RESOURCES.length} Referensi
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="p-5 glass-ui-dark mb-8">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">Referensi Primer</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Aplikasi ini adalah titik awal. Untuk pemahaman yang lebih mendalam, eksplorasi referensi berikut — jurnal peer-reviewed, atlas anatomi standar, dan sumber daya multimedia terpilih.
            </p>
          </div>

          {/* Resource Groups */}
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-0.5 bg-[var(--color-accent-secondary)] rounded" />
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">{category}</h2>
                <span className="px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] font-bold rounded-full border border-[var(--border-light)]">{items.length}</span>
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
                    className="flex items-start gap-4 p-4 glass-ui-dark hover:border-[var(--color-accent-secondary)]/30 transition-all group"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: TYPE_COLORS[resource.type] + "15", border: `1px solid ${TYPE_COLORS[resource.type]}30` }}
                    >
                      {TYPE_ICONS[resource.type]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--color-accent-secondary)] transition-colors">{resource.title}</h3>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: TYPE_COLORS[resource.type] + "15", color: TYPE_COLORS[resource.type] }}
                        >
                          {resource.source}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-full border border-[var(--border-light)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[var(--text-secondary)] group-hover:text-[var(--color-accent-secondary)] transition-colors flex-shrink-0 mt-1">
                      <ExternalLink size={16} />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}

          <div className="h-px bg-[var(--border-light)] my-6" />
          <p className="text-[11px] text-center text-[var(--text-secondary)]">
            Semua tautan menuju sumber eksternal. CardioLearn tidak berafiliasi dengan platform tersebut.
          </p>
        </div>
      </div>
    </div>
  );
}
