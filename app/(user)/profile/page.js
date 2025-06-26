"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Supabase } from "@/lib/supabase-browser";
import "@/styles/Profile.css";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ username: "", avatar_url: "" });
  const [stats, setStats] = useState({ artworks: 0, likes: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await Supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: artworks } = await Supabase
        .from("artworks")
        .select("username, avatar_url, likes")
        .eq("user_id", user.id);

      if (artworks && artworks.length > 0) {
        const latest = artworks[0];
        const likes = artworks.reduce((sum, a) => sum + (a.likes || 0), 0);
        setProfile({
          username: latest.username || user.email,
          avatar_url: latest.avatar_url || ""
        });
        setStats({ artworks: artworks.length, likes });
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await Supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div className="profile-wrapper">Loading...</div>;

  return (
    <div className="profile-wrapper">
    <Sidebar/>
      <div className="profile-card">
        <div className="avatar-section">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">{user.email?.[0]?.toUpperCase()}</div>
          )}
        </div>

        <h2>{profile.username || user.email}</h2>
        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>

        <div className="stats">
          <div><strong>{stats.artworks}</strong><br />Artworks</div>
          <div><strong>{stats.likes}</strong><br />Likes</div>
        </div>

        <a href="/dashboard" className="profile-btn">🎨 Your Artworks</a>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}
