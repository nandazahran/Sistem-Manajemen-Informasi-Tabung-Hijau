import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans overflow-x-hidden scroll-smooth">
      
      {/* NAVBAR */}
      <nav className="w-full bg-[#0A391D] px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          {/* Ikon Recycle Sederhana */}
          <div className="bg-[#F7941D] p-1.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          SIM-TH
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-200">
          <a href="#home" className="text-[#F7941D] hover:text-[#F7941D] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#F7941D] transition-colors">About</a>
          <a href="#how-it-works" className="hover:text-[#F7941D] transition-colors">How it Works</a>
          <a href="#benefits" className="hover:text-[#F7941D] transition-colors">Benefits</a>
          <a href="#contact" className="hover:text-[#F7941D] transition-colors">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl tracking-tight">
          <span className="text-[#F7941D]">Clean</span> <span className="text-[#0A391D]">campus &</span> <br />
          <span className="text-[#F7941D]">green</span> <span className="text-[#0A391D]">future</span>
        </h1>
        <p className="mt-6 text-gray-600 max-w-2xl text-lg">
          Sistem digital untuk pengelolaan sampah kampus yang terstruktur dan memberikan nilai ekonomi
        </p>
        <Link to="/login" className="mt-8 px-8 py-3.5 bg-[#F7941D] text-white font-bold rounded-full shadow-lg hover:bg-[#e0861b] transform hover:-translate-y-1 transition-all">
          Get Started
        </Link>
        
        {/* Placeholder Ilustrasi Hero (Ganti dengan SVG dari Figma) */}
        <div className="mt-16 w-full max-w-5xl h-64 bg-[#0A391D]/10 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#0A391D]/30">
          <p className="text-[#0A391D] font-semibold">TARUH GAMBAR ILUSTRASI HERO DI SINI NANTI YAA</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="bg-[#0A391D] text-white py-24 px-8 md:px-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            About <span className="text-[#F7941D]">the</span><br/>initiative.
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10 text-lg">
            SIM-TH adalah sistem informasi yang mendukung program <span className="text-[#F7941D] font-semibold">Tabung Hijau</span> dalam pengelolaan sampah berbasis kampus secara digital, terstruktur, dan transparan. <br/><br/>
            Dengan teknologi modern, kami membantu kampus mengelola sampah dengan lebih efisien sambil memberikan nilai ekonomi bagi mahasiswa.
          </p>
          <div className="flex gap-10">
            <div>
              <h3 className="text-4xl font-extrabold text-[#F7941D]">100+</h3>
              <p className="text-sm text-gray-400 mt-1">Mahasiswa Aktif</p>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-[#F7941D]">500kg</h3>
              <p className="text-sm text-gray-400 mt-1">Sampah Terkumpul</p>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-[#F7941D]">15+</h3>
              <p className="text-sm text-gray-400 mt-1">Wilayah Kampus</p>
            </div>
          </div>
        </div>
        {/* Placeholder Ilustrasi About */}
        <div className="h-96 bg-white/10 rounded-3xl flex items-center justify-center border-2 border-dashed border-white/20">
          <p className="text-white/50 font-semibold">TARUH GAMBAR DASHBOARD ABOUT DI SINI</p>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-[#F7941D] py-24 px-8 md:px-20">
        <div className="mb-16 text-white">
          <h2 className="text-5xl font-extrabold mb-4">How does<br/>it work?</h2>
          <p className="text-lg opacity-90">Proses pengelolaan sampah kampus yang sistematis dan terstruktur</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Mapping Cards */}
          {[
            { step: '01', title: 'Pengumpulan', desc: 'Mahasiswa mengumpulkan sampah' },
            { step: '02', title: 'Pemilahan', desc: 'Memilah berdasarkan jenis' },
            { step: '03', title: 'Penyetoran', desc: 'Setor ke bank sampah' },
            { step: '04', title: 'Pencatatan', desc: 'Input data digital' },
            { step: '05', title: 'Distribusi', desc: 'Pembagian hasil' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl flex flex-col hover:-translate-y-2 transition-transform">
              <h3 className="text-5xl font-extrabold text-[#F5E6D3] mb-4">{item.step}</h3>
              <div className="w-14 h-14 bg-[#0A391D] rounded-xl mb-6"></div> {/* Kotak Icon Placeholder */}
              <h4 className="text-xl font-bold text-[#0A391D] mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="bg-[#FAF8F5] py-24 px-8 md:px-20">
        <div className="mb-16">
          <h2 className="text-5xl font-extrabold text-[#0A391D] mb-4">Benefits<span className="text-[#F7941D]">.</span></h2>
          <p className="text-gray-600 text-lg">Keuntungan yang didapat dari program Tabung Hijau untuk kampus dan mahasiswa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#0A391D] p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#0A391D] rounded-2xl mb-6"></div>
            <p className="text-xs font-bold tracking-wider text-[#0A391D] mb-2 uppercase">Environmental</p>
            <h3 className="text-2xl font-extrabold text-[#0A391D] mb-4">Mengurangi sampah</h3>
            <p className="text-gray-600">Volume sampah kampus berkurang signifikan dengan sistem pemilahan yang terorganisir.</p>
          </div>
          <div className="bg-white border border-[#F7941D] p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#F7941D] rounded-2xl mb-6"></div>
            <p className="text-xs font-bold tracking-wider text-[#F7941D] mb-2 uppercase">Economic</p>
            <h3 className="text-2xl font-extrabold text-[#0A391D] mb-4">Nilai ekonomi</h3>
            <p className="text-gray-600">Sampah anorganik memiliki nilai jual yang memberikan keuntungan finansial untuk mahasiswa.</p>
          </div>
          <div className="bg-white border border-[#4CAF50] p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl mb-6"></div>
            <p className="text-xs font-bold tracking-wider text-[#4CAF50] mb-2 uppercase">Educational</p>
            <h3 className="text-2xl font-extrabold text-[#0A391D] mb-4">Kesadaran lingkungan</h3>
            <p className="text-gray-600">Meningkatkan kepedulian dan edukasi mahasiswa terhadap pengelolaan sampah yang berkelanjutan.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-[#FAF8F5] pb-24 px-8 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-[#0A391D] mb-4">Contact <span className="text-[#F7941D]">Us.</span></h2>
          <p className="text-gray-600 text-lg">Hubungi kami untuk informasi lebih lanjut tentang SIM-TH</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-10 md:p-14 shadow-xl flex flex-col md:flex-row gap-16 border-t-8 border-[#0A391D]">
          {/* Kiri: Info */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-extrabold text-[#0A391D] mb-8">Contact Information</h3>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-[#F7941D]/20 flex items-center justify-center rounded-xl text-[#F7941D]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                <p className="text-[#0A391D] font-semibold text-lg">simth@kampus.ac.id</p>
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A391D] mb-4">Social Media</h3>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-[#0A391D] text-white font-bold rounded-full text-sm">Instagram</button>
              <button className="px-6 py-2 bg-[#0A391D] text-white font-bold rounded-full text-sm">Twitter</button>
            </div>
          </div>

          {/* Kanan: Form */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <input type="text" placeholder="Nama Lengkap" className="w-full bg-[#F5F5F5] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D]" />
            <input type="email" placeholder="Email" className="w-full bg-[#F5F5F5] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D]" />
            <textarea placeholder="Pesan Anda" rows="4" className="w-full bg-[#F5F5F5] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A391D] resize-none"></textarea>
            <button className="w-full bg-[#0A391D] text-white py-4 rounded-xl font-bold hover:bg-[#072a15] transition-all shadow-md mt-2">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A391D] py-6 text-center text-gray-400 text-sm">
        © 2026 SIM-TH - Sistem Informasi Manajemen Tabung Hijau. All rights reserved.
      </footer>

    </div>
  );
}

export default LandingPage;