import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

function KelolaKategoriPage() {
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  
  // States Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis');
  const [isJenisOpen, setIsJenisOpen] = useState(false);

  // Data from backend
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for add/edit
  const [formName, setFormName] = useState('');
  const [formHarga, setFormHarga] = useState('');

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token || !baseUrl) return;
      const res = await fetch(`${baseUrl}/kategori`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.status === 'sukses' && result.data) {
        const mapped = result.data.map(c => ({
          id: c.id,
          name: c.nama_kategori,
          jenis: 'Daur Ulang',
          harga: c.harga_per_kg.toLocaleString('id-ID'),
          harga_raw: c.harga_per_kg,
          setoran: '-',
          update: '-'
        }));
        setCategories(mapped);
      }
    } catch (error) {
      console.error('Gagal fetch kategori:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Logic Filter
  const filteredCategories = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis === 'Semua Jenis' || c.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  
  const handleAction = (cat, type) => {
    setSelectedCat(cat);
    if (type === 'edit') {
      setFormName(cat.name);
      setFormHarga(cat.harga_raw.toString());
      setIsEditOpen(true);
    }
    if (type === 'delete') setIsDeleteOpen(true);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setFormName('');
    setFormHarga('');
  };

  const confirmAction = async (action) => {
    const token = getToken();
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      if (action === 'add') {
        const res = await fetch(`${baseUrl}/kategori`, {
          method: 'POST', headers,
          body: JSON.stringify({ nama_kategori: formName, harga_per_kg: parseInt(formHarga) })
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast('Kategori baru berhasil ditambahkan!');
          fetchCategories();
        } else {
          showToast(result.pesan || 'Gagal menambah kategori');
        }
      }
      if (action === 'edit') {
        const res = await fetch(`${baseUrl}/kategori/${selectedCat.id}`, {
          method: 'PUT', headers,
          body: JSON.stringify({ nama_kategori: formName, harga_per_kg: parseInt(formHarga) })
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast(`Kategori ${selectedCat.name} berhasil diperbarui!`);
          fetchCategories();
        } else {
          showToast(result.pesan || 'Gagal mengupdate kategori');
        }
      }
      if (action === 'delete') {
        const res = await fetch(`${baseUrl}/kategori/${selectedCat.id}`, {
          method: 'DELETE', headers
        });
        const result = await res.json();
        if (result.status === 'sukses') {
          showToast(`Kategori ${selectedCat.name} berhasil dihapus!`);
          fetchCategories();
        } else {
          showToast(result.pesan || 'Gagal menghapus kategori');
        }
      }
    } catch (error) {
      console.error('CRUD error:', error);
      showToast('Terjadi kesalahan pada server');
    }
    closeModals();
  };

  // Summary computed from data
  const totalKategori = categories.length;
  const avgHarga = categories.length > 0 ? categories.reduce((acc, c) => acc + c.harga_raw, 0) / categories.length : 0;
  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  return (
    <AdminLayout>
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#0B4D1E] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
          <div><h2 className="text-3xl font-extrabold mb-1">Kelola Kategori Sampah</h2><p className="text-green-100/80 font-medium">Manajemen kategori dan harga sampah</p></div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/admin/riwayat-harga')} className="bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Riwayat Harga
          </button>
          <button onClick={() => { closeModals(); setIsAddOpen(true); }} className="bg-[#F4A300] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg> Tambah Kategori
          </button>
        </div>
      </div>

      {/* FILTER & SEARCHBAR CARD */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari kategori sampah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
        </div>
        
        {/* Custom Dropdown Filter Jenis */}
        <div className="relative w-full md:w-64">
          <div 
            onClick={() => setIsJenisOpen(!isJenisOpen)}
            className="bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl cursor-pointer flex justify-between items-center hover:bg-[#EAE5DA] transition-colors"
          >
            <span className="truncate">{filterJenis}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {isJenisOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
              {['Semua Jenis', 'Daur Ulang', 'Organik', 'Non-organik'].map(jenis => (
                <div 
                  key={jenis} 
                  onClick={() => { setFilterJenis(jenis); setIsJenisOpen(false); }} 
                  className={`px-5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${filterJenis === jenis ? 'bg-[#0B4D1E] text-white' : 'text-[#0B4D1E] hover:bg-gray-100'}`}
                >
                  {jenis}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABEL DATA CARD */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F5EFE6] text-[#0B4D1E]">
              <tr>
                <th className="px-8 py-5 font-bold">Kategori</th>
                <th className="px-8 py-5 font-bold">Jenis</th>
                <th className="px-8 py-5 font-bold">Harga / kg</th>
                <th className="px-8 py-5 font-bold">Total Setoran</th>
                <th className="px-8 py-5 font-bold">Update Terakhir</th>
                <th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-bold">Memuat data...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-bold">Belum ada kategori</td></tr>
              ) : filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 flex items-center gap-3">
                    <div className="bg-[#EAE5DA] p-2 rounded-lg text-[#0B4D1E]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <span className="font-extrabold text-[#0B4D1E]">{c.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${c.jenis === 'Organik' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {c.jenis}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-extrabold text-green-600">Rp {c.harga}</td>
                  <td className="px-8 py-5 font-bold text-[#0B4D1E]">{c.setoran}</td>
                  <td className="px-8 py-5 text-gray-400 text-sm font-medium">{c.update}</td>
                  <td className="px-8 py-5 flex justify-center gap-3">
                    <button onClick={() => handleAction(c, 'edit')} className="p-2 text-gray-400 hover:text-[#F4A300] hover:bg-[#FDF6EA] rounded-lg transition-all" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    </button>
                    <button onClick={() => handleAction(c, 'delete')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Kategori</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">{totalKategori}</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Rata-rata Harga</p><h3 className="text-3xl font-extrabold text-green-600">{formatRp(avgHarga)}</h3></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"><p className="text-gray-400 text-sm font-medium mb-1">Total Setoran</p><h3 className="text-3xl font-extrabold text-[#0B4D1E]">-</h3></div>
      </div>

      {/* MODAL TAMBAH/EDIT KATEGORI */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border border-gray-100">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#0B4D1E]">{isEditOpen ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); confirmAction(isEditOpen ? 'edit' : 'add'); }}>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Nama Kategori</label>
                <input type="text" placeholder="Contoh: Botol Plastik" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" value={formName} onChange={(e) => setFormName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Jenis</label>
                <div className="relative">
                  <select className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] appearance-none cursor-pointer" defaultValue={isEditOpen ? selectedCat?.jenis : 'Daur Ulang'}>
                    <option value="Daur Ulang">Daur Ulang</option>
                    <option value="Organik">Organik</option>
                    <option value="Non-organik">Non-organik</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Harga per kg (Rp)</label>
                <input type="number" placeholder="Contoh: 4500" className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E]" value={formHarga} onChange={(e) => setFormHarga(e.target.value)} required />
              </div>
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={closeModals} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-2xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#125B2A] text-white py-4 rounded-2xl font-bold hover:bg-[#0B4D1E] shadow-md transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {isEditOpen ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteOpen && selectedCat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
            <h3 className="text-2xl font-extrabold text-[#0B4D1E] mb-2">Hapus Kategori?</h3>
            <p className="text-gray-500 font-medium mb-8 text-sm">Kategori <b>{selectedCat.name}</b> akan dihapus secara permanen.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-3.5 rounded-xl font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
              <button onClick={() => confirmAction('delete')} className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 shadow-md transition-all">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST POP DOWN */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 999999, animation: 'fadeInDown 0.3s ease-out' }} className="bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="bg-[#2E7D32] text-white rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <span className="font-extrabold text-sm">{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}

export default KelolaKategoriPage;