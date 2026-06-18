import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

function NotifikasiPage() {
	const [activeTab, setActiveTab] = useState("semua");

	const [notifikasi, setNotifikasi] = useState([]);

	const formatWaktuDB = (dateString) => {
		if (!dateString) return "-";
		const date = new Date(dateString);
		if (Number.isNaN(date.getTime())) return dateString;
		return date.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	useEffect(() => {
		const fetchNotifikasi = async () => {
			try {
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				if (!token) return;

				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/notifikasi`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				const resData = await response.json();

				if (resData.status === "sukses" && Array.isArray(resData.data)) {
					// Mapping data riil dari API
					const mappedNotif = resData.data.map((n) => ({
						id: n.id,
						type:
							n.tipe === "transaksi"
								? "check"
								: n.tipe === "hapus_transaksi"
									? "alert"
									: n.tipe === "update_transaksi"
										? "wallet"
										: "up",
						title: n.judul,
						desc: n.deskripsi || n.pesan || "",
						time: formatWaktuDB(n.waktu),
						read: n.isRead || false,
					}));

					// Tetap tambahkan notif sistem
					mappedNotif.unshift({
						id: "sys-1",
						type: "up",
						title: "Sistem Notifikasi Aktif",
						desc: "Notifikasi berjalan real-time dengan database",
						time: "Baru saja",
						read: false,
					});

					setNotifikasi(mappedNotif);
				}
			} catch (error) {
				console.error("Gagal mengambil data notifikasi:", error);
			}
		};
		fetchNotifikasi();

		// Dengarkan event 'notifikasi_baru' dari DashboardLayout agar langsung ter-refresh otomatis
		window.addEventListener("notifikasi_baru", fetchNotifikasi);
		return () => window.removeEventListener("notifikasi_baru", fetchNotifikasi);
	}, [formatWaktuDB]);

	const unreadCount = notifikasi.filter((n) => !n.read).length;

	const markAllAsRead = async () => {
		try {
			const baseUrl = import.meta.env.VITE_API_URL;
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");
			if (!token) return;

			const response = await fetch(`${baseUrl}/notifikasi/baca-semua`, {
				method: "PUT",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.ok) {
				setNotifikasi(notifikasi.map((n) => ({ ...n, read: true })));
				window.dispatchEvent(new Event("notifikasi_read"));
			}
		} catch (error) {
			console.error("Gagal menandai semua notifikasi dibaca:", error);
		}
	};

	const handleMarkAsRead = async (id) => {
		if (id === "sys-1") return;
		try {
			const baseUrl = import.meta.env.VITE_API_URL;
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");
			if (!token) return;

			const response = await fetch(`${baseUrl}/notifikasi/${id}/baca`, {
				method: "PUT",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.ok) {
				setNotifikasi((prev) =>
					prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
				);
				window.dispatchEvent(new Event("notifikasi_read"));
			}
		} catch (error) {
			console.error("Gagal menandai notifikasi dibaca:", error);
		}
	};

	const displayedNotif =
		activeTab === "semua" ? notifikasi : notifikasi.filter((n) => !n.read);

	// Helper fungsi render icon
	const renderIcon = (type) => {
		if (type === "up")
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/>
				</svg>
			);
		if (type === "check")
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			);
		if (type === "alert")
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			);
		if (type === "wallet")
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
					/>
				</svg>
			);
		return null;
	};

	return (
		<DashboardLayout>
			{/* HEADER BANNER */}
			<div className="bg-[#0B4D1E] rounded-3xl p-10 flex items-center justify-between shadow-sm mt-2 mb-6 text-white">
				<div className="flex items-center gap-4">
					<div className="relative bg-[#F4A300] p-3 rounded-2xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
						{unreadCount > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0B4D1E]">
								{unreadCount}
							</span>
						)}
					</div>
					<div>
						<h2 className="text-3xl font-extrabold mb-1">Notifikasi</h2>
						<p className="text-green-100/80 font-medium">
							{unreadCount} notifikasi belum dibaca
						</p>
					</div>
				</div>
				<button
					onClick={markAllAsRead}
					className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-colors border border-white/30"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Tandai Semua Dibaca
				</button>
			</div>

			{/* TABS SEMUA / BELUM DIBACA */}
			<div className="flex bg-white rounded-full p-2 mb-8 shadow-sm border border-gray-100 w-max">
				<button
					onClick={() => setActiveTab("semua")}
					className={`px-8 py-2.5 rounded-full font-bold text-sm transition-colors ${activeTab === "semua" ? "bg-[#0B4D1E] text-white" : "text-gray-500 hover:text-[#0B4D1E]"}`}
				>
					Semua
				</button>
				<button
					onClick={() => setActiveTab("belum-dibaca")}
					className={`px-8 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === "belum-dibaca" ? "bg-[#0B4D1E] text-white" : "text-gray-500 hover:text-[#0B4D1E]"}`}
				>
					Belum Dibaca
					{unreadCount > 0 && (
						<span
							className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === "belum-dibaca" ? "bg-[#F4A300] text-white" : "bg-[#F4A300] text-white"}`}
						>
							{unreadCount}
						</span>
					)}
				</button>
			</div>

			{/* LIST NOTIFIKASI */}
			<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
				{displayedNotif.length > 0 ? (
					displayedNotif.map((notif) => (
						<div
							key={notif.id}
							onClick={() => handleMarkAsRead(notif.id)}
							className={`flex items-start justify-between p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer ${!notif.read ? "bg-[#FDF9F0] border-[#F4A300]/30" : "bg-white border-gray-100"}`}
						>
							<div className="flex gap-4">
								<div
									className={`p-3 rounded-full flex-shrink-0 ${!notif.read ? "bg-green-100 text-[#0B4D1E]" : "bg-gray-100 text-gray-400"}`}
								>
									{renderIcon(notif.type)}
								</div>
								<div>
									<h4
										className={`font-extrabold text-lg mb-1 ${!notif.read ? "text-[#0B4D1E]" : "text-gray-700"}`}
									>
										{notif.title}
									</h4>
									<p className="text-sm font-medium text-gray-600">
										{notif.desc}
									</p>
									<p className="text-xs text-gray-400 mt-2">{notif.time}</p>
								</div>
							</div>
							{!notif.read && (
								<div className="w-3 h-3 bg-[#F4A300] rounded-full mt-4"></div>
							)}
						</div>
					))
				) : (
					<p className="text-center text-gray-400 py-10 font-bold">
						Tidak ada notifikasi di sini.
					</p>
				)}
			</div>
		</DashboardLayout>
	);
}

export default NotifikasiPage;
