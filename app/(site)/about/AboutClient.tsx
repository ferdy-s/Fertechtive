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
              className="text-3xl md:text-5xl lg:text-[56px] font-extrabold leading-tight tracking-tight"
            >
              Tentang{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
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
              <strong>Web Developer</strong> dan <strong>UI/UX Designer</strong>{" "}
              dengan pengalaman lebih dari tiga tahun. <br />
              <br />
              Platform ini menjadi ruang untuk mendokumentasikan karya dan
              eksperimen saya di bidang <strong>
                website development
              </strong>, <strong>UI/UX Designer</strong>,{" "}
              <strong>Graphic Design</strong>, dan{" "}
              <strong>Digital Marketing</strong> berbasis data, dengan fokus
              pada pengalaman pengguna, performa, dan keberlanjutan digital.
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
                    {/* LABEL NAVIGASI */}
                    <div
                      className="
hidden lg:flex items-center gap-2
px-5 py-3 mb-4
rounded-xl
bg-gradient-to-b from-white/35 to-white/10
backdrop-blur-xl
text-sm font-semibold
text-white
shadow-[0_8px_30px_rgba(0,0,0,0.35)]
"
                    >
                      <PanelLeft className="w-4 h-4" />
                      Navigasi Modul
                    </div>

                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                      {modules.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setActive(m.id)}
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
                          <div className="flex items-center justify-center">
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
                      <section>
                        <header className="max-w-3xl">
                          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            Pendekatan Pengembangan
                          </h2>

                          <p className="mt-4 text-white/70 leading-relaxed">
                            Pendekatan kerja saya menggabungkan desain
                            pengalaman pengguna, arsitektur perangkat lunak yang
                            terstruktur, serta praktik software engineering
                            modern untuk menghasilkan sistem digital yang
                            stabil, efisien, dan mudah dikembangkan.
                          </p>
                        </header>

                        <div className="grid gap-5 md:grid-cols-2 mt-10">
                          {[
                            {
                              title: "Pendekatan Berbasis Pengguna",
                              icon: <Users className="w-5 h-5 text-white" />,
                              points: [
                                "Analisis kebutuhan pengguna, audiens, dan stakeholder sebelum proses perancangan dimulai.",
                                "Perancangan user journey dan alur interaksi yang jelas untuk memastikan pengalaman pengguna yang intuitif.",
                                "Validasi konsep melalui wireframe, prototype, serta evaluasi awal terhadap desain dan fungsi sistem.",
                                "Pendekatan ini digunakan dalam pengembangan website, desain UI/UX, serta strategi komunikasi visual.",
                              ],
                            },
                            {
                              title: "Struktur Sistem dan Desain Terorganisir",
                              icon: (
                                <LayoutGrid className="w-5 h-5 text-white" />
                              ),
                              points: [
                                "Perancangan arsitektur sistem yang modular agar mudah dikembangkan dan dipelihara.",
                                "Pengembangan desain visual yang konsisten melalui sistem desain dan identitas brand.",
                                "Integrasi antar komponen sistem untuk memastikan pengalaman pengguna yang konsisten.",
                                "Pendekatan ini mendukung pengembangan website, aplikasi, desain grafis, serta platform digital lainnya.",
                              ],
                            },
                            {
                              title: "Efisiensi dan Optimasi Performa",
                              icon: <Zap className="w-5 h-5 text-white" />,
                              points: [
                                "Optimasi performa website dan aplikasi agar cepat diakses di berbagai perangkat.",
                                "Pengelolaan sumber daya digital secara efisien untuk menjaga stabilitas sistem.",
                                "Penggunaan pendekatan desain yang ringan dan responsif untuk meningkatkan kenyamanan pengguna.",
                                "Strategi ini juga diterapkan dalam optimasi konten digital dan performa pemasaran online.",
                              ],
                            },
                            {
                              title: "Evaluasi dan Pengembangan Berkelanjutan",
                              icon: (
                                <RefreshCw className="w-5 h-5 text-white" />
                              ),
                              points: [
                                "Monitoring performa sistem dan pengalaman pengguna secara berkala.",
                                "Analisis data interaksi pengguna untuk meningkatkan kualitas produk digital.",
                                "Iterasi desain dan pengembangan berdasarkan hasil evaluasi penggunaan.",
                                "Pendekatan ini memastikan produk digital terus berkembang sesuai kebutuhan pengguna dan pasar.",
                              ],
                            },
                          ].map((item, i) => (
                            <article
                              key={i}
                              className="
      rounded-2xl border border-white/20
      bg-white/[0.07] backdrop-blur-xl
      p-8
      hover:bg-white/[0.12]
      transition-all duration-300
      shadow-[0_10px_40px_rgba(0,0,0,0.3)]
    "
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}

                                <h3 className="text-lg font-semibold">
                                  {item.title}
                                </h3>
                              </div>

                              <ul className="mt-4 space-y-2 text-sm text-white/70 leading-relaxed">
                                {item.points.map((p, pi) => (
                                  <li key={pi}>• {p}</li>
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
                            Kemampuan teknis saya mencakup berbagai disiplin
                            dalam pengembangan produk digital modern, mulai dari
                            pengembangan website, desain pengalaman pengguna,
                            pembuatan identitas visual, hingga strategi
                            pemasaran digital. Pendekatan ini memungkinkan saya
                            untuk membangun produk digital yang tidak hanya
                            berfungsi secara teknis, tetapi juga memiliki nilai
                            visual, pengalaman pengguna yang baik, serta
                            strategi distribusi yang efektif.
                          </p>
                        </header>

                        <div className="grid gap-6 md:grid-cols-2 mt-10">
                          {[
                            {
                              icon: <Globe className="h-5 w-5 text-white" />,
                              title: "Web Development",
                              desc: "Pengembangan website modern yang cepat, responsif, dan mudah dikembangkan untuk berbagai kebutuhan bisnis maupun produk digital.",
                              points: [
                                "Pengembangan antarmuka website modern dengan struktur yang efisien, performa tinggi, serta pengalaman pengguna yang konsisten di berbagai perangkat.",
                                "Penerapan desain responsif agar website optimal di berbagai perangkat",
                                "Integrasi API dan layanan backend untuk sistem dinamis",
                                "Optimasi performa website untuk kecepatan akses dan stabilitas sistem",
                                "Penerapan praktik SEO teknis agar website mudah ditemukan oleh mesin pencari",
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
                            Berbagai tools dan teknologi berikut digunakan dalam
                            proses pengembangan produk digital. Teknologi ini
                            mendukung pembuatan sistem yang stabil, desain
                            visual yang konsisten, serta strategi distribusi
                            digital yang efektif.
                          </p>
                        </header>

                        <div className="grid gap-6 md:grid-cols-2 mt-10">
                          {[
                            {
                              category: "Website Development",
                              icon: <Globe className="w-5 h-5 text-white" />,
                              desc: "Teknologi yang digunakan untuk membangun website modern dengan performa tinggi, struktur yang scalable, serta pengalaman pengguna yang responsif.",
                              tools: [
                                {
                                  name: "HTML5",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                                },
                                {
                                  name: "CSS3",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                                },
                                {
                                  name: "JavaScript",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                                },
                                {
                                  name: "React",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                                },
                                {
                                  name: "Next.js",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
                                },
                                {
                                  name: "TailwindCSS",
                                  icon: "https://skillicons.dev/icons?i=tailwind",
                                },
                                {
                                  name: "Node.js",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
                                },
                                {
                                  name: "Laravel",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
                                },
                                {
                                  name: "PHP",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
                                },
                                {
                                  name: "Python",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                                },
                                {
                                  name: "REST API",
                                  icon: "https://cdn-icons-png.flaticon.com/512/2165/2165004.png",
                                },
                                {
                                  name: "JWT",
                                  icon: "https://jwt.io/img/logo.svg",
                                },
                                {
                                  name: "PostgreSQL",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
                                },
                                {
                                  name: "MySQL",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                                },
                                {
                                  name: "Visual Studio Code",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
                                },
                              ],
                            },

                            {
                              category: "UI UX Design",
                              icon: <PenTool className="w-5 h-5 text-white" />,
                              desc: "Tools desain yang digunakan untuk merancang pengalaman pengguna yang intuitif serta menciptakan antarmuka yang konsisten dan mudah digunakan.",
                              tools: [
                                {
                                  name: "Figma",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
                                },
                                {
                                  name: "Framer",
                                  icon: "https://cdn.simpleicons.org/framer/0055FF",
                                },
                                {
                                  name: "Adobe XD",
                                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg",
                                },
                                {
                                  name: "Design System",
                                  icon: "https://img.icons8.com/fluency/48/design.png",
                                },
                                {
                                  name: "Wireframing",
                                  icon: "https://img.icons8.com/color/48/web-design.png",
                                },
                                {
                                  name: "Prototyping",
                                  icon: "https://img.icons8.com/fluency/48/prototype.png",
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
                              ],
                            },

                            {
                              category: "Digital Marketing",
                              icon: (
                                <TrendingUp className="w-5 h-5 text-white" />
                              ),
                              desc: "Tools yang digunakan untuk menganalisis performa website, meningkatkan visibilitas pada mesin pencari, serta mengelola distribusi konten digital.",
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
                                {
                                  name: "Microsoft Excel",
                                  icon: "https://img.icons8.com/color/48/microsoft-excel-2019.png",
                                },
                                {
                                  name: "Microsoft PowerPoint",
                                  icon: "https://img.icons8.com/color/48/microsoft-powerpoint-2019.png",
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

                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                                {item.tools.map((tool, ti) => (
                                  <div
                                    key={ti}
                                    className="flex flex-col items-center gap-2 text-center"
                                  >
                                    <img
                                      src={tool.icon}
                                      alt={tool.name}
                                      className="w-8 h-8 object-contain"
                                    />

                                    <span className="text-xs text-white/70">
                                      {tool.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
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
                              title: "Website Development",
                              icon: <Globe className="w-5 h-5 text-white" />,
                              desc: "Pengembangan website dengan performa tinggi, struktur yang scalable, serta pengalaman pengguna yang responsif.",
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
