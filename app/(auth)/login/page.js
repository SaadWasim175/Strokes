"use client";
import { useState } from "react";
import { Supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await Supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="stylized-text">Log into your account</h2>
        <input
          type="email"
          placeholder="Email"
          className="auth-input stylized-text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input stylized-text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="auth-button stylized-text">
          Log In
        </button>
        <p className="auth-msg stylized-text">{msg}</p>
        <p className="auth-link stylized-text">
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-gray-400 hover:text-gray-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
