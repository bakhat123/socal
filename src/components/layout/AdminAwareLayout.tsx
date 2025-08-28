"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/common/PrestigeLoading";

export default function AdminAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");
  
  return (
    <>
      {!isAdmin && <Loading />}
      {!isAdmin && <Navigation />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}