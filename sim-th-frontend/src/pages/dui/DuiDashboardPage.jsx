import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DuiLayout from '../../components/DuiLayout'; // Pastikan path importnya sesuai

function DuiDashboardPage() {
  const navigate = useNavigate();

  // Data Cards Sesuai Gambar 1
  const stats = [
    { title: 'Total Sampah Terkelola', value: '1,890 kg', badge: '+8% bulan ini', iconColor: 'text-[#0B4D1E]', iconBg: 'bg-[#EAE5DA]', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2' },
    { title: 'Total Nilai Ekonomi', value: 'Rp 6,1jt', badge: '+15% bulan ini', iconColor: 'text-green-500', iconBg: 'bg-green-50', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Wilayah Aktif', value: '8', badge: 'dari 8 total', iconColor: 'text-[#F4A300]', iconBg: 'bg-[#FDF6EA]', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { title: 'Total Transaksi', value: '1,284', badge: '+12% bulan ini', iconColor: 'text-[#0B4D1E]', iconBg: 'bg-[#EAE5DA]', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'KPI Tertinggi', value: '925', badge: 'BEM FATETA', iconColor: 'text-[#F4A300]', iconBg: 'bg-[#FDF6EA]', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { title: 'Kategori Terbanyak', value: 'Plastik', badge: '45%', iconColor: 'text-[#0B4D1E]', iconBg: 'bg-[#EAE5DA]', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];

  // Data Grafiks Sesuai Gambar 2
  const lineData = [{ name: 'Jan', berat: 1200 }, { name: 'Feb', berat: 1350 }, { name: 'Mar', berat: 1580 }, { name: 'Apr', berat: 1720 }, { name: 'Mei', berat: 1890 }];
  const barData = [{ name: 'Jan', nilai: 4500000 }, { name: 'Feb', nilai: 4800000 }, { name: 'Mar', nilai: 5200000 }, { name: 'Apr', nilai: 5600000 }, { name: 'Mei', nilai: 6100000 }];
  const pieKategori = [{ name: 'Plastik', value: 45 }, { name: 'Kertas', value: 30 }, { name: 'Logam', value: 15 }, { name: 'Kaca', value: 10 }];
  const pieWilayah = [{ name: 'FATETA', value: 385 }, { name: 'FAPET', value: 360 }, { name: 'FEM', value: 340 }, { name: 'FAHUTAN', value: 310 }, { name: 'Lainnya', value: 495 }];
  
  const COLORS_KATEGORI = ['#125B2A', '#F4A300', '#8FA57A', '#EAE5DA'];
  const COLORS_WILAYAH = ['#125B2A', '#F4A300', '#8FA57A', '#517D3B', '#D1D5DB'];

  return (
    <DuiLayout>
      {/* BANNER GRADIENT */}
      <div className="bg-gradient-to-r from-[#0B4D1E] to-[#1A7338] rounded-[2rem] p-12 flex items-center justify-between shadow-sm relative overflow-hidden mt-2 mb-8 text-white">
        <div className="z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold mb-4">Selamat Datang, DUI SIM-TH <span className="text-green-400">🌱</span></h2>
          <p className="text-green-100 font-medium text-lg mb-8">Pantau perkembangan pengelolaan sampah dan kontribusi wilayah secara terpusat.</p>
          <button onClick={() => navigate('/dui/monitoring')} className="bg-[#F4A300] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all">
            Lihat Monitoring <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        {/* Dekorasi Kanan (Bisa pakai SVG ilustrasi, ini placeholder style icon) */}
        <div className="hidden md:flex absolute right-10 bottom-0 opacity-80 pointer-events-none">
           <svg width="250" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="50" width="100" height="100" rx="20" fill="#125B2A" fillOpacity="0.5"/><rect x="60" y="60" width="30" height="20" rx="10" fill="#F4A300"/><rect x="100" y="60" width="40" height="20" rx="10" fill="#8FA57A"/><rect x="60" y="90" width="80" height="20" rx="10" fill="#8FA57A"/><rect x="60" y="120" width="80" height="10" rx="5" fill="#8FA57A"/></svg>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${s.iconBg} ${s.iconColor}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg></div>
              <span className={`text-xs font-bold ${s.badge.includes('+') ? 'text-green-500' : 'text-gray-400'}`}>{s.badge}</span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">{s.title}</p>
            <h3 className={`text-4xl font-extrabold ${s.title.includes('Kategori') ? 'text-[#0B4D1E]' : 'text-[#0B4D1E]'}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* GRAFIK GRID (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Tren Sampah */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Tren Sampah Bulanan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={40} />
                <Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => [`${value} kg`, 'Berat']} />
                <Line type="monotone" dataKey="berat" stroke="#125B2A" strokeWidth={4} dot={{r: 5, fill: '#125B2A'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pertumbuhan Nilai Ekonomi */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Pertumbuhan Nilai Ekonomi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={60} tickFormatter={(val) => `${val/1000000}jt`} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(val) => `Rp ${val.toLocaleString()}`} />
                <Bar dataKey="nilai" fill="#125B2A" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kategori Sampah Terbanyak */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Kategori Sampah Terbanyak</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => `${value}%`} />
                <Pie data={pieKategori} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieKategori.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_KATEGORI[index % COLORS_KATEGORI.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kontribusi Wilayah */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Kontribusi Wilayah (kg)</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} formatter={(value) => `${value} kg`} />
                <Pie data={pieWilayah} innerRadius={0} outerRadius={100} paddingAngle={2} dataKey="value" label={({name, value}) => `${name}: ${value}kg`} labelLine={true}>
                  {pieWilayah.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_WILAYAH[index % COLORS_WILAYAH.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DuiLayout>
  );
}

export default DuiDashboardPage;