"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Supabase } from "@/lib/supabase-browser";
import "@/styles/Topbar.css";

export default function TopNavbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await Supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await Supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="top-navbar">
      <div className="nav-left">
        <Link href="/" className="nav-logo">🖌 Strokes</Link>
      </div>
      <div className="nav-right">
        <Link href="/gallery" className={pathname === "/gallery" ? "nav-link active" : "nav-link"}>Gallery</Link>
        <Link href="/create" className={pathname === "/create" ? "nav-link active" : "nav-link"}>Create</Link>
        <Link href="/create" className={pathname === "/create" ? "nav-link active" : "nav-link"}>Github</Link>
        {user && (
          <>
            <Link href="/dashboard" className={pathname === "/dashboard" ? "nav-link active" : "nav-link"}>Dashboard</Link>
            <Link href="/profile" className={pathname === "/profile" ? "nav-link active" : "nav-link"}>Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
