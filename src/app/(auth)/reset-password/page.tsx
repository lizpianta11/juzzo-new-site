"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <span className="text-3xl">✉️</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="text-white/40 text-sm">
          We sent a password reset link to {email}
        </p>
        <Link href="/login" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="text-white/40 text-sm mt-2">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
          placeholder="Email"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-sm">
        <Link href="/login" className="text-white/40 hover:text-white transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}
