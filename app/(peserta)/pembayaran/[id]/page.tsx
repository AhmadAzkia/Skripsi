import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import PaymentStatusActions from "./PaymentStatusActions";

type PaymentPageProps = {
  params: Promise<{ id: string }>;
};

const statusCopy = {
  menunggu: {
    label: "Menunggu Pembayaran",
    description: "Checkout Midtrans sudah dibuat. Selesaikan pembayaran agar akses pelatihan dapat diproses.",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  berhasil: {
    label: "Pembayaran Berhasil",
    description: "Pembayaran Anda sudah tercatat. Akses pelatihan akan tersedia sesuai jadwal.",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  gagal: {
    label: "Pembayaran Gagal",
    description: "Pembayaran belum berhasil. Anda dapat membuka checkout Midtrans kembali.",
    className: "bg-red-50 text-red-800 border-red-200",
  },
  dikembalikan: {
    label: "Pembayaran Dikembalikan",
    description: "Transaksi ini tercatat sebagai pengembalian dana.",
    className: "bg-gray-50 text-gray-800 border-gray-200",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function PaymentStatusPage({ params }: PaymentPageProps) {
  const { id } = await params;
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: payment, error } = await supabase
    .from("pembayaran")
    .select(
      `
      id,
      jumlah,
      status_pembayaran,
      metode_pembayaran,
      id_pembayaran_eksternal,
      dibuat_pada,
      dibayar_pada,
      kursus:kursus_id (
        id,
        judul,
        kategori,
        tipe_kursus
      )
    `
    )
    .eq("id", id)
    .eq("pengguna_id", userData.profile.id)
    .single();

  if (error || !payment) {
    notFound();
  }

  const kursus = Array.isArray(payment.kursus) ? payment.kursus[0] : payment.kursus;
  const copy = statusCopy[payment.status_pembayaran];

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-navy text-white p-6">
            <p className="text-sm text-gold font-semibold mb-2">Status Pembayaran</p>
            <h1 className="text-2xl md:text-3xl font-bold">{kursus?.judul || "Pelatihan CertiGuardia"}</h1>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className={`rounded-lg border p-5 ${copy.className}`}>
              <h2 className="text-xl font-bold mb-2">{copy.label}</h2>
              <p className="text-sm leading-relaxed">{copy.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold text-navy">{formatCurrency(payment.jumlah)}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Order ID Midtrans</p>
                <p className="font-semibold text-navy break-all">{payment.id_pembayaran_eksternal || "-"}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Metode Pembayaran</p>
                <p className="font-semibold text-navy">{payment.metode_pembayaran || "Belum dipilih"}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Tanggal Transaksi</p>
                <p className="font-semibold text-navy">{formatDate(payment.dibayar_pada || payment.dibuat_pada)}</p>
              </div>
            </div>

            {kursus && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-navy mb-3">Ringkasan Pelatihan</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-sm bg-navy/10 text-navy">{kursus.kategori}</span>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 capitalize">{kursus.tipe_kursus}</span>
                </div>
              </div>
            )}

            <PaymentStatusActions kursusId={kursus?.id || ""} paymentId={payment.id} status={payment.status_pembayaran} />
          </div>
        </div>
      </div>
    </div>
  );
}
