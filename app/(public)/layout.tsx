import NavbarPublic from "@/app/components/navbars/PublicNavbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarPublic />
      {children}
    </>
  );
}
