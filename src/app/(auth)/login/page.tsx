"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "/discover";
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/discover` },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-white/40 text-sm mt-2">Sign in to your account</p>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-colors"
        >
          <span>🔵</span> Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("apple")}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-colors"
        >
          <span>🍎</span> Continue with Apple
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>

      <div className="flex justify-between text-sm">
        <Link href="/reset-password" className="text-white/40 hover:text-white transition-colors">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
          Create account
        </Link>
      </div>
    </div>
  );
}
