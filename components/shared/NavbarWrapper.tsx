"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

/**
 * Renders the dark Navbar on all pages EXCEPT the homepage ("/"),
 * which uses its own LandingNavbar.
 */
export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar />;
}
