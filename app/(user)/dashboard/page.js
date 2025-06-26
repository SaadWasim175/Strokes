"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Supabase } from "@/lib/supabase-browser";
import "@/styles/Dashboard.css";

export default function DashboardPage() {
  const [artworks, setArtworks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndArtworks = async () => {
      const { data: userData } = await Supabase.auth.getUser();
      if (!userData?.user) return;

      setUser(userData.user);

      //   TODO: replace this with real fetch from your 'artworks' table
      const { data, error } = await Supabase.from("artworks")
        .select("*")
        .eq("user_id", userData.user.id);

      if (!error) setArtworks(data || []);
    };

    fetchUserAndArtworks();
  }, []);

  const handleDelete = async (id) => {
    await Supabase.from("artworks").delete().eq("id", id);
    setArtworks((prev) => prev.filter((art) => art.id !== id));
  };

  return (
<div className="dashboard-layout">

  <div className="dashboard-content">
    <h1 className="dashboard-title">Your Artwork</h1>
    {artworks.length === 0 ? (
      <div className="empty-art">
        <p>No artwork posted yet.</p>
        <Link href="/create" className="create-btn">Start Creating →</Link>
      </div>
    ) : (
      <div className="art-grid">
        {artworks.map((art) => (
          <div key={art.id} className="art-card">
            <div className="square-thumb">
              <img
                src={art.url || "/placeholder.jpg"}
                alt="Artwork"
                className="art-thumbnail"
              />
            </div>
            <div className="art-info">
              <h3>{art.title || "Untitled"}</h3>
              <p>{art.views ?? 0} views</p>
              <button onClick={() => handleDelete(art.id)} className="btn-del">Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>



  );
}
