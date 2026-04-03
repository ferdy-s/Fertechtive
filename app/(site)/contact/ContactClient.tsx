"use client";

import { useState } from "react";
import { Instagram, Github, Mail } from "lucide-react";
import { FaTiktok, FaFacebook, FaWhatsapp, FaLinkedin } from "react-icons/fa";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const phoneNumber = "6282134027993";

  const sendToWhatsApp = () => {
    if (!name || !email || !message) {
      setError("Harap isi semua field sebelum mengirim pesan.");
      return;
    }

    setError("");

    const text = `Halo, saya menghubungi Anda melalui website Fertechtive.%0A%0A
Nama: ${name}%0A
Email: ${email}%0A%0A
Pesan:%0A${message}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <section className="relative w-full">
      {/* SAFE OFFSET FROM FLOATING NAVBAR */}
      <div className="h-28 sm:h-32 lg:h-44" />

      {/* CONTACT CONTENT */}
      <div className="px-4 pb-18">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Kontak{" "}
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Ferdy.S
                </span>
              </h1>
              <div className="space-y-4 max-w-ld">
                <p className="mt-5 text-[15px] md:text-[17px] lg:text-[14px] text-white/80 leading-relaxed max-w-2xl">
                  Silakan isi formulir di bawah ini untuk menghubungi saya
                  secara langsung. Setiap pesan yang Anda kirimkan akan
                  diteruskan secara otomatis ke WhatsApp pribadi Ferdy, sehingga
                  saya dapat merespons dengan cepat dan efisien.
                </p>

                <p className="mt-5 text-[15px] md:text-[17px] lg:text-[14px] text-white/80 leading-relaxed max-w-2xl">
                  Jangan ragu untuk menyampaikan pertanyaan, diskusi proyek,
                  peluang kolaborasi, maupun kerja sama profesional lainnya.
                  Saya terbuka untuk komunikasi yang jelas, terarah, dan
                  memberikan nilai bagi kedua belah pihak.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="
  inline-flex items-center
  rounded-full
  border border-white/20
  bg-gradient-to-r
  from-zinc-200/90 via-zinc-100 to-zinc-300
  px-4 py-1.5
  text-[12px]
  font-semibold
  uppercase
  tracking-wider
  text-black
  backdrop-blur
  shadow-[0_4px_12px_rgba(255,255,255,0.12)]
  transition
  hover:shadow-[0_6px_18px_rgba(255,255,255,0.2)]
"
              >
                Media Sosial
              </button>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/fertechtive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <Instagram size={16} />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/ferdy.salsabilla.520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <FaFacebook size={16} />
                  Facebook
                </a>

                <a
                  href="https://wa.me/6282134027993"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://www.tiktok.com/@fertechtive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <FaTiktok size={16} />
                  TikTok
                </a>

                <a
                  href="https://github.com/ferdy-s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <Github size={16} />
                  GitHub
                </a>

                <a
                  href="mailto:ferdysalsabilla87@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <Mail size={16} />
                  Email
                </a>

                <a
                  href="https://www.linkedin.com/in/ferdy-salsabilla-171004252/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition text-sm"
                >
                  <FaLinkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-zinc-200/10 via-white/5 to-zinc-300/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_10px_40px_rgba(255,255,255,0.05)]">
              <div className="space-y-9">
                {/* NAME + EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* NAME */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300">Nama</label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="
            w-full
            rounded-lg
            bg-white/5
            border border-white/20
            px-4 py-3
            text-sm
            text-white
            placeholder:text-zinc-400
            backdrop-blur
            transition
            focus:outline-none
            focus:border-zinc-300
            focus:ring-1
            focus:ring-zinc-300/40
            hover:border-white/40
            "
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300">Email</label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@email.com"
                      className="
            w-full
            rounded-lg
            bg-white/5
            border border-white/20
            px-4 py-3
            text-sm
            text-white
            placeholder:text-zinc-400
            backdrop-blur
            transition
            focus:outline-none
            focus:border-zinc-300
            focus:ring-1
            focus:ring-zinc-300/40
            hover:border-white/40
            "
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Pesan</label>

                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pesan Anda..."
                    className="
          w-full
          rounded-lg
          bg-white/5
          border border-white/20
          px-4 py-3
          text-sm
          text-white
          placeholder:text-zinc-400
          backdrop-blur
          resize-none
          transition
          focus:outline-none
          focus:border-zinc-300
          focus:ring-1
          focus:ring-zinc-300/40
          hover:border-white/40
          "
                  />
                </div>

                {/* BUTTON */}
                {error && (
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
                <button
                  onClick={sendToWhatsApp}
                  className="
        group
        relative
        w-full
        rounded-lg
        bg-gradient-to-r
        from-zinc-200
        via-zinc-300
        to-zinc-400
        py-3.5
        text-sm
        font-semibold
        text-black
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)]
        active:scale-[0.98]
        "
                >
                  Kirim via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* LOCATION MAP */}
      <div className=" max-w-7xl mx-auto px-6 pb-10">
        <div className="space-y-6">
          {/* Title */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <button
              className="
    inline-flex items-center
    rounded-full
    border border-white/20
    bg-gradient-to-r
    from-zinc-200/90 via-zinc-100 to-zinc-300
    px-4 py-1.5
    text-[12px]
    font-semibold
    uppercase
    tracking-wider
    text-black
    backdrop-blur
    shadow-[0_4px_12px_rgba(255,255,255,0.12)]
  "
            >
              Alamat Domisili
            </button>

            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Mari Mampir ke Rumah Saya
            </h2>

            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-3x1">
              Perumahan Citra Prima Serpong 2 Blok CC 2 No 17, Kelurahan
              Kranggan, Kecamatan Setu, Kota Tangerang Selatan, Banten.
            </p>
          </div>

          {/* Map Container */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(255,255,255,0.05)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.83942021686323!2d106.65964159528218!3d-6.338216058963101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e4f171701477%3A0xf40ecfc6651d5bdb!2sBlk.%20Dd3%20Blok%20CC2%20No.17%2C%20Kranggan%2C%20Kec.%20Setu%2C%20Kota%20Tangerang%20Selatan%2C%20Banten%2015312!5e0!3m2!1sid!2sid!4v1773027099464!5m2!1sid!2sid"
              className="w-full h-[380px] md:h-[420px] lg:h-[450px] border-0 brightness-[0.75] contrast-[1.1] grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
