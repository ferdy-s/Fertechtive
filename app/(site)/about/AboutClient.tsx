"use client";

import Link from "next/link";
import Head from "./head";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Cpu,
  Globe,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Palette,
  TrendingUp,
  Users,
  LayoutGrid,
  Zap,
  PanelLeft,
  Code2,
  RefreshCw,
} from "lucide-react";
import {
  useId,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  type ElementType,
} from "react";
import { useActionState } from "react";
import { createCvRequest } from "@/app/admin/cv/actions";

/* ---------- util ---------- */
function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

/* ================== PAGE ================== */
export default function Page() {
  return (
    <main
      role="main"
      className="relative isolate overflow-hidden bg-deep-950 text-white pt-28 md:pt-32 pb-10"
    >
      {/* background ringan dan aman performa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-deep-900 via-deep-950 to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[280px] w-[280px] rounded-full bg-cyan-500/10 blur-2xl -z-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[280px] w-[280px] rounded-full bg-violet-500/10 blur-2xl -z-10"
      />

      {/* container */}
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10 space-y-16 md:space-y-20 pt-6 md:pt-8 lg:pt-10">
        {/* ===== Breadcrumb + JSON-LD ===== */}

        {/* ===== HERO ===== */}
        <header className="grid items-start gap-10 md:grid-cols-12">
          {/* kiri */}
          <div className="md:col-span-7 max-w-3xl md:pl-6 lg:pl-10">
            <FadeIn
              as="h1"
              className="text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight"
            >
              Tentang{" "}
              <span className="font-bold underline decoration-white/20 underline-offset-8">
                Fertechtive
              </span>
            </FadeIn>

            <FadeIn
              delay={0.08}
              as="p"
              className="mt-5 text-[15px] md:text-[17px] lg:text-[15px] text-white/80 leading-relaxed max-w-2xl"
            >
              <strong>Fertechtive</strong> adalah identitas personal dari{" "}
<strong>Ferdy Salsabilla</strong>, seorang{" "}
<strong>Programmer</strong>{" "}
dengan pengalaman lebih dari tiga tahun. <br />
<br />
Platform ini menjadi ruang untuk mendokumentasikan karya dan
eksperimen saya dalam bidang <strong>Programming</strong>,{" "}
<strong>UI/UX Design</strong>, <strong>Graphic Design</strong>, dan{" "}
<strong>Digital Marketing</strong>, dengan fokus pada pengembangan
produk digital yang fungsional, intuitif, berkinerja baik, dan
berkelanjutan.
            </FadeIn>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink href="/portfolio">Lihat Portfolio</PrimaryLink>
              <RequestCvButton />
            </div>
          </div>

          {/* kanan: foto */}
          <FadeIn className="md:col-span-5 order-first md:order-none">
            <Image
              src="/cover_fertechtive.png"
              alt="foto Ferdy Salsabilla"
              width={640}
              height={410}
              priority
              sizes="(max-width: 768px) 100vw, 640px"
              className="h-auto w-full rounded-2xl border border-white/10 object-cover shadow-xl"
            />
          </FadeIn>
        </header>

        {/* ===== ENTERPRISE SAAS PROFESSIONAL MODULE ===== */}
        <section>
          <div className="mx-auto max-w-[1850px] px-6 md:px-12 lg:px-15">
            {(() => {
              const [active, setActive] = useState("approach");

              const modules = [
                {
                  id: "approach",
                  title: "Pendekatan",
                  icon: <Sparkles className="h-5 w-5" />,
                },
                {
                  id: "skills",
                  title: "Kemampuan",
                  icon: <Cpu className="h-5 w-5" />,
                },
                {
                  id: "tools",
                  title: "Tools",
                  icon: <Layers className="h-5 w-5" />,
                },
                {
                  id: "expertise",
                  title: "Bidang",
                  icon: <CheckCircle2 className="h-5 w-5" />,
                },
              ];

              return (
                <section className="grid lg:grid-cols-[260px_1fr] gap-16">
                  {/* SIDEBAR */}
                  <nav
                    aria-label="Navigasi Profesional"
                    className="lg:sticky lg:top-28 h-fit"
                  >

                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                     {modules.map((m) => (
  <button
    key={m.id}
    onClick={() => setActive(m.id)}
    aria-label={m.title}
    aria-current={active === m.id ? "page" : undefined}
    className={`
      group flex items-center justify-center lg:justify-start gap-3
      px-4 py-3 lg:px-5 lg:py-4 rounded-xl
      backdrop-blur-xl
      transition min-w-[60px] lg:min-w-full
      ${
        active === m.id
          ? "bg-white/15 text-white shadow-xl"
          : "text-white/60 hover:text-white hover:bg-white/[0.08]"
      }
    `}
  >
    <div
      className="flex items-center justify-center"
      aria-hidden="true"
    >
      {m.icon}
    </div>

    <span className="hidden lg:block text-sm font-medium">
      {m.title}
    </span>
  </button>
))}
                    </div>
                  </nav>

                {/* CONTENT */}
<div className="space-y-16 min-h-[620px]">
  {/* APPROACH */}
  {active === "approach" && (
    <section aria-labelledby="pendekatan-pengembangan">
      <header className="max-w-3xl">
        <div className="flex items-center gap-3">
          <h2
            id="pendekatan-pengembangan"
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            Pendekatan Pengembangan
          </h2>
        </div>

        <p className="mt-4 text-white/70 leading-relaxed text-[15px]">
          Pendekatan kerja saya menggabungkan UX, arsitektur software, dan
          software engineering modern untuk menghasilkan sistem yang stabil,
          efisien, dan scalable.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 mt-10">
        {[
          {
            icon: <Users className="h-5 w-5 text-white" />,
            title: "Pendekatan Berbasis Pengguna",
            points: [
              "Analisis kebutuhan pengguna, audiens, dan stakeholder sebelum proses perancangan dimulai.",
              "Perancangan user journey dan alur interaksi yang jelas untuk memastikan pengalaman pengguna yang intuitif.",
              "Validasi konsep melalui wireframe, prototype, serta evaluasi awal terhadap desain dan fungsi sistem.",
              "Pendekatan ini digunakan dalam pengembangan website, desain UI/UX, serta strategi komunikasi visual.",
            ],
          },

          {
            icon: <LayoutGrid className="h-5 w-5 text-white" />,
            title: "Struktur Sistem dan Desain Terorganisir",
            points: [
              "Perancangan arsitektur sistem yang modular agar mudah dikembangkan dan dipelihara.",
              "Pengembangan desain visual yang konsisten melalui sistem desain dan identitas brand.",
              "Integrasi antar komponen sistem untuk memastikan pengalaman pengguna yang konsisten.",
              "Pendekatan ini mendukung pengembangan website, aplikasi, desain grafis, serta platform digital lainnya.",
            ],
          },

          {
            icon: <Zap className="h-5 w-5 text-white" />,
            title: "Efisiensi dan Optimasi Performa",
            points: [
              "Optimasi performa website dan aplikasi agar cepat diakses di berbagai perangkat.",
              "Pengelolaan sumber daya digital secara efisien untuk menjaga stabilitas sistem.",
              "Penggunaan pendekatan desain yang ringan dan responsif untuk meningkatkan kenyamanan pengguna.",
              "Strategi ini juga diterapkan dalam optimasi konten digital dan performa pemasaran online.",
            ],
          },

          {
            icon: <RefreshCw className="h-5 w-5 text-white" />,
            title: "Evaluasi dan Pengembangan Berkelanjutan",
            points: [
              "Monitoring performa sistem dan pengalaman pengguna secara berkala.",
              "Analisis data interaksi pengguna untuk meningkatkan kualitas produk digital.",
              "Iterasi desain dan pengembangan berdasarkan hasil evaluasi penggunaan.",
              "Pendekatan ini memastikan produk digital terus berkembang sesuai kebutuhan pengguna dan pasar.",
            ],
          },
        ].map((approach, i) => (
          <article
            key={i}
            className="rounded-2xl border border-white/20
bg-white/[0.07] backdrop-blur-xl
p-8 hover:bg-white/[0.12]
transition duration-300"
          >
            <div className="flex items-center gap-3">
              {approach.icon}

              <h3 className="text-lg font-semibold">
                {approach.title}
              </h3>
            </div>

            <ul className="mt-4 list-disc pl-5 text-sm text-white/70 space-y-2">
              {approach.points.map((point, pi) => (
                <li key={pi}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )}

                    {/* SKILLS */}
                    {active === "skills" && (
                      <section aria-labelledby="kemampuan-teknis">
                        <header className="max-w-3xl">
                          <div className="flex items-center gap-3">
                            <h2
                              id="kemampuan-teknis"
                              className="text-3xl md:text-4xl font-semibold tracking-tight"
                            >
                              Kemampuan Teknis Profesional
                            </h2>
                          </div>

                          <p className="mt-4 text-white/70 leading-relaxed text-[15px]">
                           Kemampuan teknis saya mencakup pengembangan website, UI/UX, identitas visual, dan pemasaran digital untuk membangun produk digital yang fungsional, menarik, dan efektif.
                          </p>
                        </header>

                        <div className="grid gap-6 md:grid-cols-2 mt-10">
                          {[
                           {
  icon: <Code2 className="h-5 w-5 text-white" />,
  title: "Programming",
  desc: "Pengembangan software end-to-end meliputi full-stack, mobile, API, database, workflow, serta AI & data.",
  points: [
    "Pengembangan aplikasi web dan mobile yang responsif, efisien, dan scalable.",
    "Integrasi RESTful API, authentication, dan layanan backend untuk sistem dinamis.",
    "Pengelolaan database serta penerapan arsitektur software yang maintainable.",
    "Penerapan development tools dan workflow untuk mendukung proses pengembangan.",
    "Implementasi AI & data seperti collaborative filtering, cosine similarity, dan recommendation system.",
  ],
},

                            {
                              icon: <PenTool className="h-5 w-5 text-white" />,
                              title: "UI UX Design",
                              desc: "Perancangan pengalaman pengguna yang intuitif dan mudah dipahami sehingga produk digital dapat digunakan secara efisien.",
                              points: [
                                "Perancangan user flow dan struktur navigasi aplikasi",
                                "Pembuatan wireframe dan prototype untuk validasi konsep desain",
                                "Penerapan design system agar konsistensi visual tetap terjaga",
                                "Pengujian usability untuk memastikan kemudahan penggunaan",
                                "Optimalisasi pengalaman pengguna pada desktop maupun mobile",
                              ],
                            },

                            {
                              icon: <Palette className="h-5 w-5 text-white" />,
                              title: "Graphic Design",
                              desc: "Pembuatan elemen visual dan identitas desain yang kuat untuk mendukung komunikasi brand secara konsisten.",
                              points: [
                                "Perancangan identitas visual seperti logo dan brand guideline",
                                "Pembuatan materi desain untuk kebutuhan digital maupun media sosial",
                                "Pengolahan visual menggunakan Adobe Photoshop dan Illustrator",
                                "Penerapan komposisi warna, tipografi, dan layout yang profesional",
                                "Pengembangan aset visual yang konsisten dengan identitas brand",
                              ],
                            },

                            {
                              icon: (
                                <TrendingUp className="h-5 w-5 text-white" />
                              ),
                              title: "Digital Marketing",
                              desc: "Perencanaan strategi pemasaran digital untuk meningkatkan visibilitas produk dan menjangkau audiens yang lebih luas.",
                              points: [
                                "Optimasi SEO untuk meningkatkan visibilitas website pada mesin pencari",
                                "Pengelolaan strategi konten digital untuk berbagai platform",
                                "Analisis performa menggunakan data dan tools analytics",
                                "Perencanaan distribusi konten melalui berbagai kanal digital",
                                "Evaluasi dan peningkatan strategi pemasaran berbasis data",
                              ],
                            },
                          ].map((skill, i) => (
                            <article
                              key={i}
                              className="rounded-2xl border border-white/20
bg-white/[0.07] backdrop-blur-xl
p-8 hover:bg-white/[0.12]
transition duration-300"
                            >
                              <div className="flex items-center gap-3">
                                {skill.icon}

                                <h3 className="text-lg font-semibold">
                                  {skill.title}
                                </h3>
                              </div>

                              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                                {skill.desc}
                              </p>

                              <ul className="mt-4 list-disc pl-5 text-sm text-white/70 space-y-2">
                                {skill.points.map((p, pi) => (
                                  <li key={pi}>{p}</li>
                                ))}
                              </ul>
                            </article>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* TOOLS */}
                    {active === "tools" && (
                      <section aria-labelledby="tools-stack">
                        <header className="max-w-3xl">
                          <h2
                            id="tools-stack"
                            className="text-3xl md:text-4xl font-semibold tracking-tight"
                          >
                            Tools dan Teknologi yang Digunakan
                          </h2>

                          <p className="mt-5 text-white/70 leading-relaxed text-[15px]">
                            Berbagai tools dan teknologi digunakan untuk mendukung pengembangan sistem, desain visual, dan distribusi digital yang efektif.
                          </p>
                        </header>

                        <div className="grid gap-6 md:grid-cols-2 mt-10">
                          {[
                 {
  category: "Programming",
  icon: <Code2 className="w-5 h-5 text-white" />,
  desc: "Technical skills & teknologi untuk software, full-stack, mobile, workflow, serta AI & data development.",
  tools: [
    /* FULL STACK DEVELOPMENT */
    {
      name: "React.js",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "Next.js",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    },
    {
      name: "TypeScript",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      name: "JavaScript",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "Tailwind CSS",
      group: "Full Stack Development",
      icon:
        "https://skillicons.dev/icons?i=tailwind",
    },
    {
      name: "Laravel",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    },
    {
      name: "PHP",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    },
    {
      name: "Node.js",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "Python",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "RESTful API",
      group: "Full Stack Development",
      icon:
        "https://cdn-icons-png.flaticon.com/512/2165/2165004.png",
    },
    {
      name: "Authentication",
      group: "Full Stack Development",
      icon:
        "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
    },
    {
      name: "PostgreSQL",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
    {
      name: "MySQL",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
  name: "GraphQL",
  group: "Full Stack Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
},
    {
      name: "Prisma ORM",
      group: "Full Stack Development",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
    },

   /* MOBILE APPLICATION DEVELOPMENT */
{
  name: "Flutter",
  group: "Mobile Application Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
},
{
  name: "Dart",
  group: "Mobile Application Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
},
{
  name: "Kotlin",
  group: "Mobile Application Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
},
{
  name: "React Native",
  group: "Mobile Application Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
},
{
  name: "Firebase",
  group: "Mobile Application Development",
  icon:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
},
    /* DEVELOPMENT TOOLS & WORKFLOW */
    {
      name: "Git",
      group: "Development Tools & Workflow",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    },
    {
      name: "GitHub",
      group: "Development Tools & Workflow",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    },
    {
      name: "Visual Studio Code",
      group: "Development Tools & Workflow",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    },
    {
      name: "Thunder Client",
      group: "Development Tools & Workflow",
      icon:
        "https://www.thunderclient.com/favicon.ico",
    },
    {
      name: "Android Studio",
      group: "Development Tools & Workflow",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
    },

    /* AI & DATA DEVELOPMENT */
    {
      name: "Collaborative Filtering",
      group: "AI & Data Development",
      icon:
        "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
    },
    {
      name: "Cosine Similarity",
      group: "AI & Data Development",
      icon:
        "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
    },
    {
      name: "Recommendation System",
      group: "AI & Data Development",
      icon:
        "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
    },
    {
  name: "Data Analysis",
  group: "AI & Data Development",
  icon:
    "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
},
{
  name: "Machine Learning",
  group: "AI & Data Development",
  icon:
    "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
},
  ],
},

             {
  category: "UI UX Design",
  icon: <PenTool className="w-5 h-5 text-white" />,
  desc: "Tools & metode untuk merancang UI/UX yang intuitif, konsisten, dan mudah digunakan.",
  tools: [
    // UI/UX DESIGN TOOLS
    {
      name: "Figma",
      group: "UI/UX DESIGN TOOLS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    },
    {
      name: "Framer",
      group: "UI/UX DESIGN TOOLS",
      icon: "https://cdn.simpleicons.org/framer/0055FF",
    },
    {
      name: "Adobe XD",
      group: "UI/UX DESIGN TOOLS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg",
    },
    {
      name: "Sketch",
      group: "UI/UX DESIGN TOOLS",
      icon: "https://cdn.simpleicons.org/sketch/F7B500",
    },
    {
      name: "FigJam",
      group: "UI/UX DESIGN TOOLS",
      icon: "https://cdn.simpleicons.org/figjam/F24E1E",
    },

    // DESIGN SYSTEM & INTERFACE
    {
      name: "Design System",
      group: "DESIGN SYSTEM & INTERFACE",
      icon: "https://img.icons8.com/fluency/48/design.png",
    },
    {
      name: "Wireframing",
      group: "DESIGN SYSTEM & INTERFACE",
      icon: "https://img.icons8.com/color/48/web-design.png",
    },
    {
      name: "Prototyping",
      group: "DESIGN SYSTEM & INTERFACE",
      icon: "https://img.icons8.com/fluency/48/prototype.png",
    },
    {
      name: "User Flow",
      group: "DESIGN SYSTEM & INTERFACE",
      icon: "https://img.icons8.com/fluency/48/flow-chart.png",
    },
    {
      name: "Information Architecture",
      group: "DESIGN SYSTEM & INTERFACE",
      icon: "https://img.icons8.com/fluency/48/organization.png",
    },

    // UX RESEARCH & STRATEGY
    {
      name: "User Research",
      group: "UX RESEARCH & STRATEGY",
      icon: "https://img.icons8.com/fluency/48/search.png",
    },
    {
      name: "User Persona",
      group: "UX RESEARCH & STRATEGY",
      icon: "https://img.icons8.com/fluency/48/user-male-circle.png",
    },
    {
      name: "User Journey",
      group: "UX RESEARCH & STRATEGY",
      icon: "https://img.icons8.com/fluency/48/journey.png",
    },
    {
      name: "Usability Testing",
      group: "UX RESEARCH & STRATEGY",
      icon: "https://img.icons8.com/fluency/48/test-passed.png",
    },
    {
      name: "Competitive Analysis",
      group: "UX RESEARCH & STRATEGY",
      icon: "https://img.icons8.com/fluency/48/combo-chart.png",
    },

    // VISUAL DESIGN
 {
  name: "Typography",
  group: "VISUAL DESIGN",
  icon: "https://api.iconify.design/mdi/format-letter-case.svg?color=%23FFFFFF",
},
{
  name: "Color Theory",
  group: "VISUAL DESIGN",
  icon: "https://api.iconify.design/mdi/palette.svg?color=%23FFD43B",
},
{
  name: "Responsive Design",
  group: "VISUAL DESIGN",
  icon: "https://api.iconify.design/mdi/responsive.svg?color=%2338BDF8",
},
{
  name: "Accessibility",
  group: "VISUAL DESIGN",
  icon: "https://api.iconify.design/mdi/accessibility.svg?color=%234ADE80",
},
{
  name: "Visual Hierarchy",
  group: "VISUAL DESIGN",
  icon: "https://api.iconify.design/mdi/layers.svg?color=%23C084FC",
},
  ],
},

                            {
                              category: "Graphic Design",
                              icon: <Palette className="w-5 h-5 text-white" />,
                              desc: "Software desain visual yang digunakan untuk membuat identitas visual, materi promosi, serta berbagai kebutuhan desain digital.",
                              tools: [
                                {
                                  name: "Adobe Photoshop",
                                  icon: "https://skillicons.dev/icons?i=ps",
                                },
                                {
                                  name: "Adobe Illustrator",
                                  icon: "https://skillicons.dev/icons?i=ai",
                                },
                                {
                                  name: "CorelDRAW",
                                  icon: "https://cdn.simpleicons.org/coreldraw/46A247",
                                },
                                {
  name: "Canva",
  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
},
                              ],
                            },

                            {
                              category: "Digital Marketing",
                              icon: (
                                <TrendingUp className="w-5 h-5 text-white" />
                              ),
                              desc: "Tools untuk menganalisis performa website, meningkatkan SEO, dan mengelola distribusi konten digital.",
                              tools: [
                                {
                                  name: "Google Analytics",
                                  icon: "https://cdn.simpleicons.org/googleanalytics/E37400",
                                },
                                {
                                  name: "Google Search Console",
                                  icon: "https://cdn.simpleicons.org/googlesearchconsole/458CF5",
                                },
                                {
                                  name: "Meta Business Suite",
                                  icon: "https://cdn.simpleicons.org/meta",
                                },
                                {
                                  name: "Ahrefs SEO Analysis",
                                  icon: "/icon/ahrefs.svg",
                                },
                              ],
                            },
                          ].map((item, i) => (
                            <article
                              key={i}
                              className="rounded-2xl p-8
bg-gradient-to-br from-white/[0.08] to-white/[0.02]
border border-white/20
backdrop-blur-xl
hover:bg-white/[0.12]
transition duration-300"
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}

                                <h3 className="text-lg font-semibold">
                                  {item.category}
                                </h3>
                              </div>

                              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                                {item.desc}
                              </p>

{/* ==========================================
    GROUPED CATEGORIES
========================================== */}
{item.category === "Programming" ||
item.category === "UI UX Design" ? (
  <div
    className="
      mt-5
      max-h-[430px]
      overflow-y-auto
      overscroll-contain
      scroll-smooth
      pr-1
      [-ms-overflow-style:none]
      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
    "
  >
    {(() => {
      const groups = item.tools.reduce(
        (acc, tool) => {
          if (!("group" in tool) || !tool.group) {
            return acc;
          }

          if (!acc[tool.group]) {
            acc[tool.group] = [];
          }

          acc[tool.group].push(tool);

          return acc;
        },
        {} as Record<string, typeof item.tools>
      );

      return Object.entries(groups).map(
        ([groupName, groupTools]) => (
          <section
            key={groupName}
            aria-labelledby={`skill-group-${groupName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`}
            className="mb-5 last:mb-0"
          >
            {/* CATEGORY */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-px flex-1 bg-white/10"
                aria-hidden="true"
              />

              <h4
                id={`skill-group-${groupName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-white/40
                  whitespace-nowrap
                "
              >
                {groupName}
              </h4>

              <div
                className="h-px flex-1 bg-white/10"
                aria-hidden="true"
              />
            </div>

            {/* TOOLS */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-2 gap-y-4">
              {groupTools.map((tool, ti) => (
                <div
                  key={`${groupName}-${tool.name}-${ti}`}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-start
                    gap-1.5
                    text-center
                    min-w-0
                  "
                >
                  <div className="flex items-center justify-center w-9 h-9 shrink-0">
                    <img
                      src={tool.icon}
                      alt={`${tool.name} technology icon`}
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="
                        w-8
                        h-8
                        object-contain
                        transition-transform
                        duration-200
                        group-hover:scale-[1.02]
                      "
                    />
                  </div>

                  <span
                    title={tool.name}
                    className="
                      text-[10px]
                      leading-[1.25]
                      text-white/65
                      line-clamp-2
                    "
                  >
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )
      );
    })()}
  </div>
) : (
  /* ==========================================
     OTHER CATEGORIES
  ========================================== */
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
    {item.tools.map((tool, ti) => (
      <div
        key={`${item.category}-${tool.name}-${ti}`}
        className="
          flex
          flex-col
          items-center
          justify-start
          gap-2
          text-center
        "
      >
        <div className="flex items-center justify-center w-9 h-9 shrink-0">
          <img
            src={tool.icon}
            alt={`${tool.name} tool icon`}
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className="w-8 h-8 object-contain"
          />
        </div>

        <span
          title={tool.name}
          className="
            text-xs
            leading-tight
            text-white/70
          "
        >
          {tool.name}
        </span>
      </div>
    ))}
  </div>
)}
                            </article>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* EXPERTISE */}
                    {active === "expertise" && (
                      <section>
                        <header className="max-w-3xl">
                          <h2 className="text-3xl md:text-4xl font-semibold">
                            Bidang Profesional
                          </h2>

                          <p className="mt-4 text-white/70 leading-relaxed">
                            Bidang utama yang menjadi fokus kontribusi saya
                            dalam pengembangan produk digital modern. Setiap
                            bidang berikut mengarahkan langsung ke portfolio
                            terkait untuk melihat hasil karya yang telah saya
                            kerjakan.
                          </p>
                        </header>

                        <div className="grid gap-5 md:grid-cols-2 mt-10">
                          {[
                           {
  title: "Programming",
  icon: <Code2 className="w-5 h-5 text-white" />,
  desc: "Pengembangan software end-to-end mencakup full-stack, mobile, API, database, workflow, serta AI & data.",
  href: "/portfolio/category/programming",
},
                            {
                              title: "UI UX Design",
                              icon: <PenTool className="w-5 h-5 text-white" />,
                              desc: "Perancangan pengalaman pengguna yang intuitif melalui wireframe, prototype, serta sistem desain yang konsisten.",
                              href: "/portfolio/category/uiux",
                            },
                            {
                              title: "Graphic Design",
                              icon: <Palette className="w-5 h-5 text-white" />,
                              desc: "Pembuatan identitas visual, desain grafis, serta berbagai kebutuhan desain digital untuk brand dan produk.",
                              href: "/portfolio/category/graphic",
                            },
                            {
                              title: "Digital Marketing",
                              icon: (
                                <TrendingUp className="w-5 h-5 text-white" />
                              ),
                              desc: "Strategi distribusi konten digital, optimasi SEO, serta analisis performa untuk meningkatkan visibilitas produk.",
                              href: "/portfolio/category/marketing",
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-xl p-8 hover:bg-white/[0.12] transition duration-300 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  {item.icon}

                                  <h3 className="text-lg font-semibold">
                                    {item.title}
                                  </h3>
                                </div>

                                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="mt-6">
                                <Link
                                  href={item.href}
                                  aria-label={`Lihat portfolio ${item.title}`}
                                  className="
          inline-flex items-center justify-center
          px-4 py-2 text-sm font-medium
          rounded-md
          border border-white/30
          bg-gradient-to-b from-white/30 to-white/10
          text-white
          hover:from-white/40 hover:to-white/20
          transition
        "
                                >
                                  Lihat Portfolio
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </section>
              );
            })()}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ===== Motion helper agar ramah Lighthouse ===== */
function FadeIn({
  as,
  className,
  children,
  delay = 0,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  const shouldReduce = useReducedMotion();
  const Tag = (as || "div") as keyof typeof motion;
  const MotionTag = (motion as any)[Tag] ?? motion.div;

  // Always render the same element with the same className on SSR & client.
  // No initial inline styles => no attribute diffs during hydration.
  return (
    <MotionTag
      initial={false}
      whileInView={
        shouldReduce
          ? { opacity: 1, y: 0 } // still identical DOM; animation is effectively skipped
          : { opacity: 1, y: 0 } // target is the same; animation engine will do nothing on first paint
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduce ? 0 : 0.45, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* ===== Modal Request CV + Captcha lokal tanpa pihak eksternal ===== */
function RequestCvButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2 text-sm font-medium hover:bg-white/10 transition"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Request CV <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
      {open && <CvModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CvModal({ onClose }: { onClose: () => void }) {
  const id = useId();

  // kirim ke Server Action createCvRequest
  const initialState: { ok: string | null; error: string | null } = {
    ok: null,
    error: null,
  };
  const [state, formAction, pending] = useActionState(
    createCvRequest,
    initialState,
  );

  // Captcha lokal: math + honeypot + time trap
  const openedAt = useMemo(() => Date.now(), []);
  const { a, b, op, answer } = useMemo(() => {
    const ops = ["+", "−"] as const;
    const a = Math.floor(6 + Math.random() * 7); // 6..12
    const b = Math.floor(2 + Math.random() * 7); // 2..8
    const op = ops[Math.random() > 0.5 ? 1 : 0];
    const answer = op === "+" ? a + b : a - b;
    return { a, b, op, answer };
  }, []);

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      const t = setTimeout(onClose, 1200);
      return () => clearTimeout(t);
    }
  }, [state.ok, onClose]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget as HTMLFormElement;
    const hp = (form.elements.namedItem("hp") as HTMLInputElement)?.value ?? "";
    const elapsed = Date.now() - openedAt;

    if (hp.trim() !== "") {
      e.preventDefault();
      setCaptchaError("Terjadi kesalahan. Silakan coba lagi.");
      return;
    }
    if (elapsed < 2500) {
      e.preventDefault();
      setCaptchaError(
        "Form terlalu cepat dikirim. Coba lagi dalam beberapa detik.",
      );
      return;
    }
    if (parseInt(captchaInput, 10) !== answer) {
      e.preventDefault();
      setCaptchaError("Jawaban captcha tidak sesuai.");
      return;
    }
    setCaptchaError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center px-7 pt-24 pb-10">
      <button
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Tutup modal"
      />
      <div
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-modal="true"
        className="
relative z-10
w-full max-w-lg
rounded-2xl
border border-white/10
bg-deep-900
p-5 md:p-6
shadow-2xl
max-h-[85vh] overflow-y-auto
"
      >
        <h3
          id={`${id}-title`}
          className="text-xl md:text-2xl text-center font-semibold"
        >
          Request CV
        </h3>

        <form
          action={formAction}
          className="mt-4 space-y-4"
          noValidate
          onSubmit={handleSubmit}
        >
          {/* honeypot */}
          <div className="sr-only" aria-hidden>
            <label>
              Jangan diisi
              <input name="hp" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {/* time trap */}
          <input type="hidden" name="openedAt" value={String(openedAt)} />

          <Field label="Nama Lengkap" name="fullName" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Perusahaan atau Organisasi (opsional)" name="company" />
          <TextareaField label="Pesan (opsional)" name="message" />

          {/* Captcha */}
          <div className="grid gap-1">
            <label className="text-sm md:text-[15px] text-white/80">
              Verifikasi
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm md:text-[15px]">
                {a} {op} {b} = ?
              </span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                name="captchaAnswer"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm md:text-[15px] outline-none focus:border-white/40"
                aria-describedby={`${id}-capdesc`}
                required
              />
              <input
                type="hidden"
                name="captchaQuestion"
                value={`${a}${op}${b}`}
              />
            </div>
            <p
              id={`${id}-capdesc`}
              className="text-[12px] md:text-[13px] text-white/60"
            >
              Jawab operasi di atas untuk mengirim permintaan.
            </p>
            <p aria-live="polite" className="text-sm text-rose-400">
              {captchaError}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow disabled:opacity-60"
            >
              {pending ? "Mengirim…" : "Kirim"}
            </button>
          </div>

          {state.error && (
            <p className="text-sm text-rose-400">{state.error}</p>
          )}
          {state.ok && (
            <p className="text-sm text-emerald-300">
              {state.ok ||
                "Terima kasih. Verifikasi akan dikirim melalui email sebelum CV PDF dikirim."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1">
      <label className="text-sm md:text-[15px] text-white/80">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm md:text-[15px] outline-none focus:border-white/40"
      />
    </div>
  );
}

function TextareaField({ label, name }: { label: string; name: string }) {
  return (
    <div className="grid gap-1">
      <label className="text-sm md:text-[15px] text-white/80">{label}</label>
      <textarea
        name={name}
        rows={3}
        className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm md:text-[15px] outline-none focus:border-white/40"
      />
    </div>
  );
}

/* ===== Links ===== */
function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full bg-white px-6 py-2 text-sm md:text-[15px] font-semibold text-black shadow hover:opacity-90 transition"
    >
      {children}
    </Link>
  );
}
