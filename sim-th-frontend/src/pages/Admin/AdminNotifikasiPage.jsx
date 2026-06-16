import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

function AdminNotifikasiPage() {
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // State Data Riil
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Form Broadcast
  const [broadcastJudul, setBroadcastJudul] = useState('');
  const [broadcastPesan, setBroadcastPesan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${baseUrl}/notifikasi`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      
      if (resData.status === 'sukses' && Array.isArray(resData.data)) {
        const mappedNotif = resData.data.map(n => ({
          id: n.id,
          title: n.judul,
          desc: n.deskripsi || n.pesan || '',
          time: formatWaktuDB(n.waktu),
          read: n.isRead || false,
          type: n.tipe
        }));
        setNotifications(mappedNotif);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data histori notifikasi:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatWaktuDB = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastJudul.trim() || !broadcastPesan.trim()) return;

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await fetch(`${baseUrl}/notifikasi/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          judul: broadcastJudul,
          pesan: broadcastPesan
        })
      });

      const resData = await response.json();
      if (response.ok && resData.status === 'sukses') {
        alert(resData.pesan || 'Broadcast notifikasi sukses dikirim!');
        setBroadcastJudul('');
        setBroadcastPesan('');
        setIsBroadcastOpen(false);
        fetchNotifications();
      } else {
        alert(resData.pesan || 'Gagal mengirim broadcast.');
      }
    } catch (error) {
      console.error("Gagal melakukan aksi broadcast:", error);
      alert('Terjadi kesalahan jaringan server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = searchTerm === '' || 
                        n.title?.toLowerCase().includes(searchLower) || 
                        n.desc?.toLowerCase().includes(searchLower);
    
    let matchStatus = true;
    if (filterStatus === 'Belum Dibaca') matchStatus = !n.read;
    if (filterStatus === 'Sudah Dibaca') matchStatus = n.read;
    
    return matchSearch && matchStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${baseUrl}/notifikasi/baca-semua`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Gagal menandai semua notifikasi dibaca:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${baseUrl}/notifikasi/${id}/baca`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.error("Gagal menandai notifikasi dibaca:", error);
    }
  };

  return (
    <AdminLayout>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }`}</style>

      {/* BANNER UTAMA */}
      <div className="bg-[#125B2A] rounded-[2rem] p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mt-2 mb-8 border border-white/60">
        <div className="flex items-center gap-5 text-white mb-6 md:mb-0">
          <div className="bg-[#F4A300] p-4 rounded-2xl relative shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#125B2A] shadow-sm">{unreadCount}</span>}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">Pusat Notifikasi</h2>
            <p className="text-green-100/80 font-medium">{unreadCount} notifikasi belum dibaca</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={markAllAsRead} className="bg-transparent text-white border border-white/40 px-6 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 
            Tandai Semua Dibaca
          </button>
          <button onClick={() => setIsBroadcastOpen(true)} className="bg-[#F4A300] text-white px-6 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#d68e00] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> 
            Broadcast Notifikasi
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari notifikasi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F5EFE6] px-14 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#0B4D1E] transition-shadow" />
        </div>
        <div className="relative w-48">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-[#F5EFE6] text-[#0B4D1E] font-bold px-5 py-4 rounded-2xl outline-none cursor-pointer appearance-none transition-shadow focus:ring-2 focus:ring-[#0B4D1E]">
            <option>Semua</option><option>Belum Dibaca</option><option>Sudah Dibaca</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4D1E] pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>
      </div>

      {/* DAFTAR NOTIFIKASI */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        <h3 className="font-extrabold text-xl text-[#0B4D1E] mb-6">Notifikasi Terbaru</h3>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500 font-bold animate-pulse">Memuat notifikasi...</div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`flex justify-between items-center p-6 rounded-3xl transition-all cursor-pointer ${notif.read ? 'bg-white border border-gray-100 hover:shadow-sm' : 'bg-[#FDF6EA] border border-[#F4A300]/30 shadow-sm'}`}>
                <div className="flex items-center gap-5">
                  <div className="bg-[#E8F5E9] p-4 rounded-2xl text-[#2E7D32]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <div>
                    <p className="font-extrabold text-[#0B4D1E] text-base">{notif.title}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{notif.desc}</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2">{notif.time}</p>
                  </div>
                </div>
                {!notif.read && <div className="w-2.5 h-2.5 bg-[#F4A300] rounded-full mr-2 shadow-sm"></div>}
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400 font-bold italic bg-gray-50 rounded-2xl border border-dashed border-gray-100">
              Tidak ada notifikasi.
            </div>
          )}
        </div>
      </div>

      {/* MODAL BROADCAST NOTIFIKASI */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#FDF6EA] p-3 rounded-2xl text-[#F4A300]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0B4D1E]">Broadcast Notifikasi</h3>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleBroadcastSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Judul Notifikasi</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Update Harga Kategori" 
                  value={broadcastJudul}
                  onChange={(e) => setBroadcastJudul(e.target.value)}
                  required
                  className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A]" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Pesan</label>
                <textarea 
                  placeholder="Tulis pesan notifikasi..." 
                  value={broadcastPesan}
                  onChange={(e) => setBroadcastPesan(e.target.value)}
                  required
                  className="w-full bg-[#F5EFE6] px-5 py-4 rounded-2xl font-medium text-[#0B4D1E] outline-none focus:ring-2 focus:ring-[#125B2A] h-32 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0B4D1E] mb-2">Target Penerima</label>
                <div className="relative">
                  <div className="w-full bg-[#EAE5DA] px-5 py-4 rounded-2xl font-bold text-[#0B4D1E] cursor-not-allowed">
                    Semua Penerima Sistem (Global)
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setIsBroadcastOpen(false)} className="flex-1 bg-[#F5EFE6] text-[#0B4D1E] py-4 rounded-full font-bold hover:bg-[#EAE5DA] transition-all">Batal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-[#125B2A] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#0B4D1E] transition-all shadow-md disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> 
                  {isSubmitting ? 'Mengirim...' : 'Kirim Notifikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminNotifikasiPage;