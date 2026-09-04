# FERTECHTIVE - Portfolio Website by Ferdy Salsabilla

## 1. Deskripsi Proyek

Fertechive adalah website personal portfolio dan sistem manajemen konten terintegrasi yang dikembangkan sepenuhnya oleh **Ferdy Salsabilla**.  
Platform ini dirancang untuk merepresentasikan keahlian lintas disiplin dalam pengembangan web, desain UI UX, desain grafis, dan digital marketing, dengan pendekatan teknologi modern berbasis **Next.js, TypeScript, dan PostgreSQL**.

Website ini dibangun untuk memenuhi standar performa tinggi, keamanan data yang baik, serta optimasi SEO menyeluruh agar dapat tampil maksimal di mesin pencari.

---

## 2. Tujuan Sistem

1. Membangun identitas digital profesional yang kredibel dan dapat diverifikasi.  
2. Menyediakan sistem portofolio interaktif berbasis database PostgreSQL.  
3. Menghadirkan blog berbasis CMS internal untuk publikasi artikel yang relevan dengan bidang teknologi dan desain.  
4. Mengimplementasikan sistem SEO terotomasi dengan metadata, schema markup, dan sitemap dinamis.  
5. Menjamin performa website yang cepat dan responsif di semua perangkat melalui optimasi Next.js Image dan dynamic routing.  

---

## 3. Teknologi yang Digunakan

| Komponen | Teknologi |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Bahasa | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| CMS Internal | Custom CMS (Admin Panel berbasis Next.js + CRUD API) |
| UI Framework | Tailwind CSS + Framer Motion |
| Deployment | Hostinger Cloud (Node.js Runtime) |
| Image Optimization | Next.js Image + WebP Conversion |
| SEO Engine | Dynamic Meta Tag, JSON-LD Schema, Canonical URL |
| Analytics | Google Analytics 4 + Hostinger Website Insights |

---

## 4. Modul Utama

### Modul Tentang Saya
- Menampilkan profil profesional Ferdy Salsabilla dengan pendekatan storytelling.
- Dilengkapi dengan animasi mikro (Framer Motion) dan struktur informasi terukur.
- Fokus pada keahlian, pengalaman proyek, serta pendekatan desain dan teknologi.

### Modul Portofolio
- Menampilkan proyek berdasarkan kategori dengan filtering dinamis.
- Setiap proyek memiliki halaman detail lengkap dengan preview visual, teknologi yang digunakan, dan insight proses pengembangan.
- Struktur SEO teroptimasi melalui metadata individual proyek (meta title, meta description, schema creativeWork).

### Modul Blog
- Sistem manajemen artikel berbasis Markdown Editor di CMS.
- Dukungan slug otomatis, thumbnail cover, dan tagging dinamis.
- Metadata SEO otomatis berdasarkan isi konten.
- Implementasi JSON-LD Schema tipe Article untuk setiap posting.

### Modul Kontak
- Formulir pengiriman pesan dengan validasi realtime menggunakan Zod Schema.
- Pesan disimpan di database dan dikirimkan melalui API Route dengan notifikasi email SMTP.
- Keamanan input data dijamin dengan sanitasi server-side.

### Modul CMS (Content Management System)
- Login berbasis JWT dengan autentikasi aman.
- CRUD Project, Blog, SEO Setting, dan Media Management.
- Editor SEO per halaman: meta title, meta description, meta keywords.
- Dashboard statistik berisi jumlah posting, proyek aktif, dan histori update.
- Fitur sitemap generator otomatis yang memperbarui sitemap.xml setiap kali data berubah.

---

## 5. Implementasi SEO Teknis

### Struktur Metadata Dinamis
Setiap halaman memiliki metadata dinamis yang diambil dari database atau konfigurasi global:

```tsx
export const metadata = {
  title: "Portfolio Ferdy Salsabilla - Fertechive",
  description: "Karya, desain UI UX, dan proyek teknologi oleh Ferdy Salsabilla.",
  keywords: ["Ferdy Salsabilla", "Next.js", "UI UX Design", "Full Stack Developer", "Digital Marketing"],
  openGraph: {
    title: "Portfolio Ferdy Salsabilla",
    type: "website",
    url: "https://fertechive.com",
    images: "/assets/og-cover.webp",
  },
  alternates: {
    canonical: "https://fertechive.com",
  },
}
````

### JSON-LD Schema Markup

```tsx
import { ArticleJsonLd } from "next-seo";

<ArticleJsonLd
  url="https://fertechive.com/blog/panduan-seo-modern"
  title="Panduan SEO Modern untuk Website Next.js"
  authorName="Ferdy Salsabilla"
  publisherName="Fertechive"
  description="Panduan komprehensif tentang optimasi SEO untuk website berbasis Next.js."
/>
```

### Sitemap dan Robots

* Sitemap otomatis diperbarui berdasarkan data dari tabel projects dan posts.
* Robots.txt dikonfigurasi untuk mengizinkan crawling hanya pada halaman publik.
* Canonical URL dihasilkan secara otomatis untuk menghindari duplikasi indeks.

---

## 6. Optimasi Performa

1. **Server Side Rendering (SSR)** untuk konten dinamis dengan caching efisien.
2. **Static Generation (SSG)** untuk halaman portfolio dan blog.
3. **Image Optimization** melalui Next.js Image component dan WebP format.
4. **Code Splitting dan Lazy Loading** untuk komponen non-esensial.
5. **Preload dan Prefetch** untuk resource penting (font, stylesheet, icon).
6. **Brotli dan Gzip Compression** aktif di server Hostinger.
7. **Lighthouse Score**: Performance 98+, Accessibility 100, SEO 100.

---

## 7. Responsivitas dan Mobile Optimization

## Tampilan Page Portfolio

* Layout adaptif berbasis grid responsive Tailwind CSS.
* Navigasi mobile menggunakan drawer interaktif dengan animasi transisi.
* Ukuran font fleksibel menggunakan satuan clamp untuk tampilan optimal di semua resolusi.
* Dukungan gestur sentuh dan scroll halus (smooth scrolling).
* Diuji pada resolusi mulai dari 320px hingga 1920px.

| Tampilan Desktop                                      | Tampilan Mobile                                     |
| ----------------------------------------------------- | --------------------------------------------------- |
| <img width="2861" height="1667" alt="Screenshot 2025-10-21 112624" src="https://github.com/user-attachments/assets/de072e67-663b-43f7-bdfa-ab5890c53cce" /> | <img width="688" height="1483" alt="Screenshot 2025-10-21 112957" src="https://github.com/user-attachments/assets/726654b1-b52d-4d1c-a9bd-5535ea5d40ff" /> |

## Tampilan Page Dashboard Admin

Fertechtive Admin CMS adalah content management dashboard modern yang dirancang untuk mengelola seluruh ekosistem konten — mulai dari blog, project portfolio, hingga permintaan CV — dalam satu antarmuka yang efisien dan elegan.
Dibangun dengan prinsip modern UI/UX 2025, sistem ini tidak hanya berfungsi sebagai pengelola konten internal, tetapi juga dioptimalkan untuk mendukung strategi SEO dinamis guna meningkatkan visibilitas website di mesin pencari.

**Fitur Utama**

* Manajemen Proyek & Artikel - Tambah, ubah, dan arsipkan project serta postingan blog dengan mudah.

* SEO Integration - Setiap konten dilengkapi meta data dan analitik yang dirancang untuk meningkatkan performa SEO.

* Activity Monitoring - Lihat aktivitas terkini dan performa sistem secara real time.

* System Health Panel - Pantau status server, database, dan resource usage dengan tampilan ringkas dan intuitif.

* Dark Mode Interface - Desain futuristik dengan fokus pada keterbacaan dan kenyamanan pengguna profesional.

**Tujuan Pengembangan**

Dashboard ini dikembangkan untuk menjadi pusat kendali bagi seluruh aktivitas digital Fertechtive mulai dari publikasi konten, manajemen proyek, hingga content optimization dalam satu sistem yang efisien, elegan, dan terintegrasi.

<img width="2832" height="1661" alt="Screenshot 2025-10-23 134800" src="https://github.com/user-attachments/assets/016ec7d4-f82d-463a-bcb3-39bba4ea23da" />


---

## 8. Deployment dan Integrasi

| Komponen              | Platform                                 |
| --------------------- | ---------------------------------------- |
| Hosting               | Hostinger Cloud (Node.js Runtime)        |
| Database              | PostgreSQL di Hostinger Database Cluster |
| Continuous Deployment | GitHub Actions (Auto Build and Deploy)   |
| Domain                | fertechive.com                           |
| SSL                   | Let’s Encrypt (otomatis dari Hostinger)  |
| Analytics             | Google Analytics 4                       |
| CDN                   | Cloudflare Global Edge Network           |

---

## 9. Keamanan Sistem

* Enkripsi environment variable di file `.env` (tidak diunggah ke repo).
* Validasi input server-side menggunakan Zod dan Prisma validator.
* Token autentikasi berbasis JWT yang terenkripsi.
* Sanitasi data upload file dan pembatasan MIME Type.
* Log aktivitas CMS tersimpan untuk audit keamanan.

---

## 10. Pengujian dan Maintenance

* Unit Testing untuk API Routes menggunakan Jest.
* Integration Testing CMS CRUD menggunakan Playwright.
* Lighthouse Test otomatis pada pipeline GitHub Actions.
* Backup database mingguan di Hostinger.
* Logging server menggunakan Hostinger Monitoring dan Error Reporter.

---

## 11. Kontributor

Seluruh proses desain, pengembangan, dan implementasi sistem Fertechive — meliputi UI UX Design, Front-End Development, Back-End Programming, Database Architecture, SEO Implementation, CMS Engineering, serta Deployment dikerjakan secara penuh oleh:

**Ferdy Salsabilla**
Full Stack Developer dan System Architect

---

## 12. Lisensi

Fertechive dikembangkan dan dimiliki sepenuhnya oleh Ferdy Salsabilla.
Seluruh kode, desain, dan dokumentasi berada di bawah lisensi **MIT License**.
© 2025 Ferdy Salsabilla. All rights reserved.
