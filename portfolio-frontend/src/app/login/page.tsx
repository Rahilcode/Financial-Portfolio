"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-md animate-fadeIn">
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=100&q=80"
            alt="Login Illustration"
            className="h-20 w-20 rounded-full object-cover shadow-md"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-4 text-center">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Password"
            type="password"
          />
          {err && <div className="text-red-500 text-sm">{err}</div>}
          <button
            disabled={loading}
            className="w-full bg-accent text-white px-4 py-2 rounded-md"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-accent font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
