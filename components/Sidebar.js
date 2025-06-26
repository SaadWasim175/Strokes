"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Palette,
  FolderOpen,
  Github,
  Menu,
  X,
  Album
} from "lucide-react";
import "@/styles/Sidebar.css";
import { Supabase } from "@/lib/supabase-browser";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Create", href: "/create", icon: Palette },
  { name: "My Artwork", href: "/dashboard", icon: FolderOpen },
  { name: "GitHub", href: "https://github.com/SaadWasim175/Strokes.git", icon: Github, external: true },
  {name: "Gallery", href:"/gallery", icon:Album}
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userEmail, setUserEmail] = useState("");


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await Supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };

    getUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  return (
    <>
      {isMobile && (
        <button className="mobile-float-toggle" onClick={toggleSidebar}>
          {showSidebar ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          isMobile ? (showSidebar ? "mobile-open" : "mobile-closed") : ""
        }`}
      >
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        {!collapsed && userEmail && (
          <Link href='/profile' className="user-section">
            <div className="user-avatar">{getInitial(userEmail)}</div>
            <div className="user-email">{userEmail}</div>
          </Link>
        )}

        <nav>
          <ul className="sidebar-list">
            {navItems.map(({ name, href, icon: Icon, external }) => (
              <li key={name} className="sidebar-item">
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon size={20} />
                    {!collapsed && <span>{name}</span>}
                  </a>
                ) : (
                  <Link href={href}>
                    <Icon size={20} />
                    {!collapsed && <span>{name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
