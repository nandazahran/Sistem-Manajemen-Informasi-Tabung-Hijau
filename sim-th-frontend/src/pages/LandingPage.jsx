import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function LandingPage() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
    const handleScroll = () => {
      const sections = ['home', 'about', 'how-it-works', 'benefits', 'contact'];
      let currentSection = 'home';
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i]);
        if (section && window.scrollY >= section.offsetTop - 150) {
          currentSection = sections[i];
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFE6] font-sans scroll-smooth overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[#0B4D1E] px-8 py-4 flex justify-between items-center z-100 shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-[#F4A300] p-1.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          SIM-TH
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-200">
          <a href="#home" className={`transition-colors ${activeSection === 'home' ? 'text-[#F4A300] font-bold' : 'hover:text-[#F4A300]'}`}>Home</a>
          <a href="#about" className={`transition-colors ${activeSection === 'about' ? 'text-[#F4A300] font-bold' : 'hover:text-[#F4A300]'}`}>About</a>
          <a href="#how-it-works" className={`transition-colors ${activeSection === 'how-it-works' ? 'text-[#F4A300] font-bold' : 'hover:text-[#F4A300]'}`}>How it Works</a>
          <a href="#benefits" className={`transition-colors ${activeSection === 'benefits' ? 'text-[#F4A300] font-bold' : 'hover:text-[#F4A300]'}`}>Benefits</a>
          <a href="#contact" className={`transition-colors ${activeSection === 'contact' ? 'text-[#F4A300] font-bold' : 'hover:text-[#F4A300]'}`}>Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-32 pb-32 px-6 flex flex-col items-center text-center">
        <h1 data-aos="zoom-in" className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl tracking-tight">
          <span className="text-[#F4A300]">Clean</span> <span className="text-[#0B4D1E]">campus &</span> <br />
          <span className="text-[#F4A300]">green</span> <span className="text-[#0B4D1E]">future</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-6 text-gray-600 max-w-2xl text-lg">
          Sistem digital untuk pengelolaan sampah kampus yang terstruktur dan memberikan nilai ekonomi
        </p>
        <div data-aos="fade-up" data-aos-delay="400">
          <Link to="/login" className="inline-block mt-8 px-8 py-3.5 bg-[#F4A300] text-white font-bold rounded-full shadow-lg hover:bg-[#d68e00] transform hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="bg-[#0B4D1E] text-white py-24 px-8 md:px-20 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
        <div data-aos="fade-right">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            About <span className="text-[#F4A300]">the</span><br/>initiative.
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10 text-lg">
            SIM-TH adalah sistem informasi yang mendukung program <span className="text-[#F4A300] font-semibold">Tabung Hijau</span> dalam pengelolaan sampah berbasis kampus secara digital, terstruktur, dan transparan. <br/><br/>
            Dengan teknologi modern, kami membantu kampus mengelola sampah dengan lebih efisien sambil memberikan nilai ekonomi bagi mahasiswa.
          </p>
        </div>
        <div data-aos="fade-left" className="h-96 bg-white/10 rounded-3xl border-2 border-dashed border-white/20 flex justify-center items-center">
            <span className="text-white/50">Gambar Ilustrasi About</span>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-[#F4A300] py-24 px-8 md:px-20 overflow-hidden">
        <div data-aos="fade-up" className="mb-16 text-white">
          <h2 className="text-5xl font-extrabold mb-4">How does<br/>it work?</h2>
          <p className="text-lg opacity-90">Proses pengelolaan sampah kampus yang sistematis dan terstruktur</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: '01', title: 'Pengumpulan', desc: 'Mahasiswa mengumpulkan sampah' },
            { step: '02', title: 'Pemilahan', desc: 'Memilah berdasarkan jenis' },
            { step: '03', title: 'Penyetoran', desc: 'Setor ke bank sampah' },
            { step: '04', title: 'Pencatatan', desc: 'Input data digital' },
            { step: '05', title: 'Distribusi', desc: 'Pembagian hasil' },
          ].map((item, index) => (
            <div key={index} data-aos="fade-up" data-aos-delay={index * 100} className="bg-white rounded-3xl p-8 shadow-xl flex flex-col hover:-translate-y-3 transition-transform duration-300">
              <h3 className="text-5xl font-extrabold text-[#F5EFE6] mb-4">{item.step}</h3>
              <div className="w-14 h-14 bg-[#0B4D1E] rounded-xl mb-6"></div>
              <h4 className="text-xl font-bold text-[#0B4D1E] mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="relative pt-24 pb-48 px-8 md:px-20 bg-linear-to-b from-[#F5EFE6] to-[#d7e3df] overflow-hidden">
        {/* Background Gunung & Air */}
        <div className="absolute bottom-0 left-0 w-full z-0 flex flex-col pointer-events-none">
          <svg className="w-full h-auto mb--2px" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#0B4D1E" fillOpacity="1" d="M0,224L80,192C160,160,320,96,480,106.7C640,117,800,203,960,213.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
          <div className="w-full h-150px bg-[#3A837A] relative">
            <div className="absolute top-4 left-[10%] w-[30%] h-1px bg-white/30 rounded-full"></div>
            <div className="absolute top-8 right-[5%] w-[40%] h-2px bg-white/20 rounded-full"></div>
            <div className="absolute top-14 left-[40%] w-[20%] h-[1.5px] bg-white/40 rounded-full"></div>
          </div>
        </div>

        <div className="relative z-10">
          <div data-aos="fade-down" className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-[#0B4D1E] mb-4">Contact <span className="text-[#F4A300]">Us.</span></h2>
            <p className="text-gray-600 text-lg">Hubungi kami untuk informasi lebih lanjut tentang SIM-TH</p>
          </div>

          {/* UDAH DIBIKIN MELENGKUNG (rounded-3xl) dan WARNA KREM */}
          <div data-aos="zoom-in-up" className="max-w-5xl mx-auto bg-[#F5EFE6] rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col md:flex-row gap-16 border border-white/50">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-8">Contact Information</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 mb-10 border border-gray-100">
                <div className="w-12 h-12 bg-[#F4A300] flex items-center justify-center rounded-xl text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                  <p className="text-[#0B4D1E] font-bold text-lg">simth@kampus.ac.id</p>
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-[#0B4D1E] mb-4">Social Media</h3>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-[#0B4D1E] text-white font-bold rounded-full text-sm hover:bg-[#083a16] transition-colors">Instagram</button>
                <button className="px-6 py-2.5 bg-[#0B4D1E] text-white font-bold rounded-full text-sm hover:bg-[#083a16] transition-colors">Twitter</button>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col gap-4">
              <input type="text" placeholder="Nama Lengkap" className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
              <input type="email" placeholder="Email" className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-all" />
              <textarea placeholder="Pesan Anda" rows="4" className="w-full bg-white px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4D1E] resize-none transition-all"></textarea>
              <button className="w-full bg-[#0B4D1E] text-white py-4 rounded-xl font-bold hover:bg-[#083a16] hover:shadow-lg transform hover:-translate-y-1 transition-all mt-2">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-[#3A837A] pt-4 pb-8 text-center text-white text-sm z-10 border-t border-white/20">
        © 2026 SIM-TH - Sistem Informasi Manajemen Tabung Hijau. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;