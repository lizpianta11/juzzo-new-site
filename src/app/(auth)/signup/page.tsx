"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) alert(error.message);
    else alert("Check your email to confirm your account!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-white/40 text-sm mt-2">Join the Juzzo universe</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
          placeholder="Username"
          required
        />
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
          placeholder="Password (min 6 characters)"
          minLength={6}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
