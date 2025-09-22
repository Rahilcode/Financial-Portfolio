"use client";

import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { username, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data || err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-md animate-fadeIn">
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=100&q=80"
            alt="Register Illustration"
            className="h-20 w-20 rounded-full object-cover shadow-md"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create account
        </h1>

        {error && (
          <p className="text-red-500 mb-2 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-accent text-white px-4 py-2 rounded-md"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
