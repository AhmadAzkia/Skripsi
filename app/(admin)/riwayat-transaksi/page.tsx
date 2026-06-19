import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const statusClass = {
  menunggu: "bg-amber-50 text-amber-700 border-amber-200",
  berhasil: "bg-green-50 text-green-700 border-green-200",
  gagal: "bg-red-50 text-red-700 border-red-200",
  dikembalikan: "bg-gray-50 text-gray-700 border-gray-200",
};

const statusLabel = {
  menunggu: "Menunggu",
  berhasil: "Berhasil",
  gagal: "Gagal",
  dikembalikan: "Dikembalikan",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default async function RiwayatTransaksiAdminPage() {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "admin") {
    redirect("/login");
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    redirect("/login");
  }

  // Auto-cleanup: hapus pembayaran menunggu yang lebih dari 24 jam
  await admin
    .from("pembayaran")
    .delete()
    .eq("status_pembayaran", "menunggu")
    .lt("dibuat_pada", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const { data: payments, error } = await admin
    .from("pembayaran")
    .select(
      `
      id,
      jumlah,
      status_pembayaran,
      metode_pembayaran,
      tipe_pembayaran,
      id_pembayaran_eksternal,
      dibuat_pada,
      dibayar_pada,
      pengguna:pengguna_id (
        nama_lengkap,
        email
      ),
      kursus:kursus_id (
        judul,
        kategori
      )
    `,
    )
    .order("dibuat_pada", { ascending: false });

  const total = payments?.length || 0;
  const berhasil = payments?.filter((payment) => payment.status_pembayaran === "berhasil").length || 0;
  const menunggu = payments?.filter((payment) => payment.status_pembayaran === "menunggu").length || 0;
  const pendapatan = payments?.filter((payment) => payment.status_pembayaran === "berhasil").reduce((sum, payment) => sum + payment.jumlah, 0) || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
            Riwayat <span className="text-gold">Transaksi</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl">Pantau tagihan, status pembayaran Midtrans, dan transaksi sertifikat seluruh peserta.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold text-navy">{total}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Berhasil</p>
            <p className="text-2xl font-bold text-green-700">{berhasil}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-amber-700">{menunggu}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pendapatan Tercatat</p>
            <p className="text-2xl font-bold text-navy">{formatCurrency(pendapatan)}</p>
          </div>
        </div>

        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-navy">Daftar Pembayaran Peserta</h2>
            {error && <p className="text-sm text-red-600 mt-2">Gagal memuat transaksi: {error.message}</p>}
          </div>

          {!payments || payments.length === 0 ? (
            <div className="p-10 text-center text-gray-600">Belum ada transaksi.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Peserta</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pelatihan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.map((payment) => {
                    const pengguna = Array.isArray(payment.pengguna) ? payment.pengguna[0] : payment.pengguna;
                    const kursus = Array.isArray(payment.kursus) ? payment.kursus[0] : payment.kursus;

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-navy">{pengguna?.nama_lengkap || "-"}</p>
                          <p className="text-sm text-gray-500">{pengguna?.email || "-"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{kursus?.judul || "-"}</p>
                          <p className="text-sm text-gray-500">{kursus?.kategori || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.id_pembayaran_eksternal || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.tipe_pembayaran.replaceAll("_", " ")}</td>
                        <td className="px-6 py-4 text-right font-semibold text-navy">{formatCurrency(payment.jumlah)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusClass[payment.status_pembayaran]}`}>{statusLabel[payment.status_pembayaran]}</span>
                          {payment.metode_pembayaran && <p className="text-xs text-gray-500 mt-1">{payment.metode_pembayaran}</p>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.dibayar_pada || payment.dibuat_pada)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
