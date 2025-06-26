"use client";
import Link from "next/link";
import "@/styles/Homepage.css";
import TopNavbar from "@/components/Topbar";
import { Supabase } from "@/lib/supabase-browser";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await Supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    checkUser();
  }, []);

  return (
    <>
      <TopNavbar />
      <main>
        <section>
          <div>
            <h1>Strokes</h1>
            <hr />
            <p>Paint, draw & publish</p>
              {user ? (
                <div className="welcome-card">
                  <p className="welcome-text">Welcome back, <span className="username">{user.email.split("@")[0]}</span>!</p>
                </div>
              ) : (
                <>
                  <Link href="/signup">
                    <button className="signup-btn">Sign Up</button>
                  </Link>
                  <Link href="/login">
                    <button className="login-btn">Login</button>
                  </Link>
                </>
              )}

          </div>
        </section>
        <section>
          <div>
            <p>Create unique pieces of artwork and publish to the world</p>
          </div>
        </section>
        <section>
          <div>
            <p>Enderboy</p>
            <p className="emoji">♛</p>
            <p id="copyright">©Copyright non-existent</p>
          </div>
        </section>
      </main>
      <div id="background">
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
        <div>
          <span />
        </div>
      </div>
    </>
  );
}
