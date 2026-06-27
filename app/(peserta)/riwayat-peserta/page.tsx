import { getUserWithRole } from "@/lib/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RiwayatPesertaPage() {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: payments } = await supabase
    .from("pembayaran")
    .select(
      `
      id,
      jumlah,
      status_pembayaran,
      metode_pembayaran,
      id_pembayaran_eksternal,
      dibuat_pada,
      pelatihan:pelatihan_id (
        judul,
        kategori
      )
    `
    )
    .eq("pengguna_id", userData.profile.id)
    .order("dibuat_pada", { ascending: false });

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
              Riwayat <span className="text-gold">Transaksi</span>
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">Kelola dan lihat status pembayaran pelatihan Anda</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-navy">Daftar Pembayaran</h2>
          </div>

          {!payments || payments.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold text-navy mb-2">Belum ada transaksi</h3>
              <p className="text-gray-600 mb-6">Pilih pelatihan berbayar untuk memulai proses checkout Midtrans.</p>
              <Link href="/katalog-pelatihan" className="inline-flex px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90">
                Lihat Katalog Pelatihan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {payments.map((payment) => {
                const pelatihan = Array.isArray(payment.pelatihan) ? payment.pelatihan[0] : payment.pelatihan;

                return (
                  <div key={payment.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusClass[payment.status_pembayaran]}`}>{statusLabel[payment.status_pembayaran]}</span>
                        {pelatihan?.kategori && <span className="px-3 py-1 rounded-full bg-navy/10 text-navy text-xs font-semibold">{pelatihan.kategori}</span>}
                      </div>
                      <h3 className="font-bold text-navy text-lg">{pelatihan?.judul || "Pelatihan CertiGuardia"}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {payment.id_pembayaran_eksternal || "Order belum tersedia"} • {formatDate(payment.dibuat_pada)}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-xl font-bold text-navy mb-3">{formatCurrency(payment.jumlah)}</p>
                      <Link href={`/pembayaran/${payment.id}`} className="inline-flex px-4 py-2 border border-navy/20 text-navy rounded-lg font-semibold hover:bg-navy/5">
                        Detail Pembayaran
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
