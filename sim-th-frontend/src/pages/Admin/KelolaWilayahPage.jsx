import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

function KelolaWilayahPage() {
  const [toastMessage, setToastMessage] = useState('');
  
  // States Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState(null);

  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Aktif' });

  // Data dari Backend
  const [wilayahData, setWilayahData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  const baseUrl = import.meta.env.VITE_API_URL;
  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  // FETCH DATA WILAYAH + LEADERBOARD
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token || !baseUrl) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch all wilayah
      const wilRes = await fetch(`${baseUrl}/wilayah`, { headers });
      const wilResult = await wilRes.json();

      // Fetch leaderboard for KPI data
      const lbRes = await fetch(`${baseUrl}/dashboard/leaderboard`, { headers });
      const lbResult = await lbRes.json();

      // Build lookup from leaderboard
      const kpiMap = {};
      if (lbResult.status === 'sukses' && lbResult.data) {
        lbResult.data.forEach((item) => {
          kpiMap[item.nama_wilayah] = {
            ranking: `#${item.peringkat}`,
            kontribusi: (item.total_berat_gram / 1000).toFixed(0),
            kpi: item.poin_kpi.toString(),
            nilaiCard: formatRp(item.total_rupiah),
            nilaiFull: item.total_rupiah.toLocaleString('id-ID'),
          };
        });
      }

      if (wilResult.status === 'sukses' && wilResult.data) {
        const mapped = wilResult.data.map((w) => {
          const kpi = kpiMap[w.nama] || { ranking: '-', kontribusi: '0', kpi: '0', nilaiCard: 'Rp 0', nilaiFull: '0' };
          return {
            id: w.id,
            name: w.nama,
            email: '',
            ranking: kpi.ranking,
            kontribusi: kpi.kontribusi,
            kpi: kpi.kpi,
            transaksi: '-',
            nilaiCard: kpi.nilaiCard,
            nilaiFull: kpi.nilaiFull,
            status: w.status,
            desc: `Wilayah ${w.nama} - Status: ${w.status}`
          };
        });
        setWilayahData(mapped);
      }
    } catch (error) {
      console.error('Gagal fetch wilayah:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Logic Filter
  const filteredWilayah = wilayahData.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  
  const handleAction = (w, type) => {
    setSelectedWilayah(w);
    if (type === 'view') setIsViewOpen(true);
    if (type === 'edit') {
      setFormData({ name: w.name, email: w.email, status: w.status });
      setIsEditOpen(true);
    }
    if (type === 'delete') setIsDeleteOpen(true);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsViewOpen(false);
    setIsDeleteOpen(false);
    setFormData({ name: '', email: '', status: 'Aktif' });
  };

  const confirmAction = async (action) => {
    const token = getToken();
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      if (action === 'add') {
        const res = await fetch(`${baseUrl}/wilayah`, {
          method: 'POST', headers,
          body: JSON.stringify({ nama: formData.name, status: formData.status })
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast('Wilayah baru berhasil ditambahkan!');
          fetchData();
        } else {
          showToast(result.pesan || 'Gagal menambah wilayah');
        }
      }
      if (action === 'edit') {
        const res = await fetch(`${baseUrl}/wilayah/${selectedWilayah.id}`, {
          method: 'PUT', headers,
          body: JSON.stringify({ nama: formData.name, status: formData.status })
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast(`Data ${selectedWilayah.name} berhasil diperbarui!`);
          fetchData();
        } else {
          showToast(result.pesan || 'Gagal mengupdate wilayah');
        }
      }
      if (action === 'delete') {
        const res = await fetch(`${baseUrl}/wilayah/${selectedWilayah.id}`, {
          method: 'DELETE', headers
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast(`Wilayah ${selectedWilayah.name} berhasil dihapus!`);
          fetchData();
        } else {
          showToast(result.pesan || 'Gagal menghapus wilayah');
        }
      }
    } catch (error) {
      console.error('CRUD error:', error);
      showToast('Terjadi kesalahan pada server');
    }
    closeModals();
  };

  // Compute summary from data
  const totalWilayah = wilayahData.length;
  const wilayahAktif = wilayahData.filter(w => w.status === 'Aktif').length;
  const totalSampah = wilayahData.reduce((acc, w) => acc + parseInt(w.kontribusi || 0), 0);
  const avgKpi = wilayahData.length > 0 ? Math.round(wilayahData.reduce((acc, w) => acc + parseInt(w.kpi || 0), 0) / wilayahData.length) : 0;

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* BANNER */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola Wilayah</h2><p className="text-green-100/80 font-medium">Monitoring dan manajemen wilayah BEM Fakultas</p></div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-[#F4A300] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> 
          Tambah Wilayah
        </button>
      </div>

      {/* SEARCHBAR & FILTER (CUSTOM DROPDOWN) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari wilayah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
        </div>
        
        {/* Custom Dropdown Filter */}
        <div className="relative w-full md:w-64">
          <div 
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
          >
            <span className="truncate">{filterStatus}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {isStatusDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
              {['Semua Status', 'Aktif', 'Nonaktif'].map(s => (
                <div 
                  key={s} 
                  onClick={() => { setFilterStatus(s); setIsStatusDropdownOpen(false); }} 
                  className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterStatus === s ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARDS WILAYAH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredWilayah.map((w) => (
          <div key={w.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
            {/* Header Card */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#EAE5DA] p-3 rounded-2xl text-[#0B4D1E]"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                <div><h3 className="font-extrabold text-lg text-[#0B4D1E]">{w.name}</h3><p className="text-gray-400 text-xs font-medium">Ranking {w.ranking}</p></div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${w.status === 'Aktif' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>{w.status}</span>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Total Kontribusi</p><p className="font-extrabold text-[#0B4D1E] text-lg">{w.kontribusi} kg</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">KPI Score</p><p className="font-extrabold text-[#F4A300] text-lg">{w.kpi}</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Total Transaksi</p><p className="font-extrabold text-[#0B4D1E] text-lg">{w.transaksi}</p></div>
              <div className="bg-[#F5EFE6] p-4 rounded-2xl"><p className="text-[10px] text-gray-500 font-medium mb-1">Nilai Ekonomi</p><p className="font-extrabold text-green-600 text-lg">Rp {w.nilaiCard}</p></div>
            </div>

            {/* Aksi Bawah (Hapus tombol Nonaktifkan, sisa icon saja) */}
            <div className="flex gap-3">
              <button onClick={() => handleAction(w, 'view')} className="p-3 text-[#0B4D1E] bg-[#EAE5DA] hover:bg-[#0B4D1E] hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
              <button onClick={() => handleAction(w, 'edit')} className="p-3 text-[#F4A300] bg-[#FFF8E1] hover:bg-[#F4A300] hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
              <button onClick={() => handleAction(w, 'delete')} className="p-3 text-red-500 bg-[#FFEBEE] hover:bg-red-500 hover:text-white rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY CARDS BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Wilayah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">{totalWilayah}</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Wilayah Aktif</p><h3 className="text-3xl font-extrabold text-[#2E7D32]">{wilayahAktif}</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Sampah</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">{totalSampah} kg</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">KPI Rata-rata</p><h3 className="text-3xl font-extrabold text-[#F4A300]">{avgKpi}</h3></div>
      </div>

      {/* MODAL TAMBAH WILAYAH */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFF8E1] p-3 rounded-full text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Tambah Wilayah Baru</h3>
              </div>
              <button onClick={closeModals} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Wilayah</label>
                <input type="text" placeholder="FATETA" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email Wilayah</label>
                <input type="email" placeholder="bem.fateta@ipb.ac.id" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Status</label>
                <div className="relative">
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={() => confirmAction('add')} className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Tambah Wilayah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT WILAYAH */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#FFF8E1] p-3 rounded-full text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Edit Wilayah</h3>
              </div>
              <button onClick={closeModals} className="text-[#0B4D1E] hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Wilayah</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Email Wilayah</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Status</label>
                <div className="relative">
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer">
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4D1E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={() => confirmAction('edit')} className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW DETAIL */}
      {isViewOpen && selectedWilayah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#E8F5E9] p-3 rounded-full text-[#125B2A]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B4D1E]">Detail {selectedWilayah.name}</h3>
              </div>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Nama Wilayah</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.name}</span>
              </div>
              <div className="py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm block mb-1">Deskripsi</span>
                <span className="font-medium text-[#125B2A] text-sm leading-relaxed">{selectedWilayah.desc}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Ranking</span>
                <span className="font-extrabold text-[#F4A300] text-sm">{selectedWilayah.ranking}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Total Kontribusi</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.kontribusi} kg</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">KPI Score</span>
                <span className="font-extrabold text-[#F4A300] text-sm">{selectedWilayah.kpi}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Total Transaksi</span>
                <span className="font-extrabold text-[#0B4D1E] text-sm">{selectedWilayah.transaksi}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Nilai Ekonomi</span>
                <span className="font-extrabold text-green-600 text-sm">Rp {selectedWilayah.nilaiFull}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium text-sm">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedWilayah.status === 'Aktif' ? 'bg-[#E8F5E9] text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedWilayah.status}
                </span>
              </div>
            </div>

            <button onClick={closeModals} className="w-full bg-[#125B2A] text-white py-4 rounded-full font-bold mt-8 hover:bg-[#0B4D1E] transition-all">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteOpen && selectedWilayah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-fade-in-up border border-gray-100">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-extrabold text-[#0B4D1E] mb-2">Hapus Wilayah?</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">Apakah Anda yakin ingin menghapus <b>{selectedWilayah.name}</b>? Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-4">
              <button onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={() => confirmAction('delete')} className="flex-1 bg-red-500 text-white py-3.5 rounded-2xl font-bold hover:bg-red-600 shadow-md transition-all">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{ animation: 'fadeInDown 0.3s ease-out' }} className="fixed top-10 right-10 z-[99999] bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaWilayahPage;