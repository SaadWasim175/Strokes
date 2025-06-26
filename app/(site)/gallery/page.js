"use client";
import { useEffect, useState } from "react";
import { Supabase } from "@/lib/supabase-browser";
import "@/styles/Gallery.css";
import Sidebar from "@/components/Sidebar";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      const { data, error } = await Supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setArtworks(data || []);
    };

    fetchArtworks();
  }, []);

  const handleLike = async (id) => {
    const art = artworks.find((a) => a.id === id);
    const updatedLikes = (art.likes ?? 0) + 1;

    const { error } = await Supabase
      .from("artworks")
      .update({ likes: updatedLikes })
      .eq("id", id);

    if (!error) {
      setArtworks((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, likes: updatedLikes } : a
        )
      );
    }
  };

  return (
    <div className="gallery-wrapper">
    <Sidebar/>
      <h1 className="gallery-title">Community Gallery</h1>

      {artworks.length === 0 ? (
        <div className="empty-state">
          <p>No artworks yet. Be the first to <a href="/create">create one →</a></p>
        </div>
      ) : (
        <div className="gallery-grid">
          {artworks.map((art) => (
            <div key={art.id} className="gallery-card">
              <div className="square-thumb" onClick={() => setSelectedArt(art)}>
                <img
                  src={art.url || "/placeholder.jpg"}
                  alt={art.title || "Artwork"}
                  className="gallery-img"
                />
              </div>
              <div className="gallery-info">
                <h3>{art.title || "Untitled"}</h3>
                <p>by {art.username || "Anonymous"}</p>
                <p>{art.views ?? 0} views</p>
                <button onClick={() => handleLike(art.id)} className="like-btn">
                  ❤️ {art.likes ?? 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArt && (
        <div className="art-modal" onClick={() => setSelectedArt(null)}>
          <div className="art-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedArt.url} alt={selectedArt.title} />
            <h2>{selectedArt.title || "Untitled"}</h2>
            <p><strong>Artist:</strong> {selectedArt.username || "Anonymous"}</p>
            <p><strong>Views:</strong> {selectedArt.views ?? 0}</p>
            <p><strong>Likes:</strong> {selectedArt.likes ?? 0}</p>
            <button onClick={() => setSelectedArt(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
