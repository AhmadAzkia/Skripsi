import NavbarPublic from "@/components/navbars/PublicNavbar";
import Footer from "../components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarPublic />
      {children}
      <Footer />
    </>
  );
}
