import type { JadwalWithInstructor } from "../page";
import { InteractiveCard } from "@/components/cards";

interface JadwalCardProps {
  jadwal: JadwalWithInstructor;
}

// Fungsi helper untuk format
const formatTanggal = (tanggal: string | null) => {
  if (!tanggal) return "Segera Hadir";
  return new Date(tanggal).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" });
};

const formatHarga = (harga: number) => {
  if (harga === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(harga);
};

export default function JadwalCard({ jadwal }: JadwalCardProps) {
  const isOnline = jadwal.tipe_pelatihan === "online";
  const isFree = jadwal.harga === 0;

  // Data untuk InteractiveCard
  const participants = `Maks. ${jadwal.maksimal_peserta} Peserta`;
  const price = isFree ? undefined : formatHarga(jadwal.harga);
  const href = `/login`;

  return InteractiveCard({
    id: jadwal.id,
    title: jadwal.judul,
    participants,
    isOnline,
    price: jadwal.harga,
    href,
    imageUrl: null,
  });
}
