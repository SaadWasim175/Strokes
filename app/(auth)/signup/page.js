"use client";
import { useState } from "react";
// import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import "@/styles/Auth.css";
import { Supabase } from "@/lib/supabase-browser";

const supabase = Supabase;

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "Check your email to confirm!");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="stylized-text">Create an Account</h2>
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
        <button onClick={handleSignUp} className="auth-button stylized-text">
          Sign Up
        </button>
        <p className="auth-msg stylized-text">{msg}</p>
        <p className="auth-link stylized-text">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-400 hover:text-gray-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
