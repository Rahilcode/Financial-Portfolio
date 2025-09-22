"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold text-primary">Portfolio</div>
        <div className="text-sm text-gray-500">Tracker</div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-sm text-gray-700">
              Hi, <span className="font-medium">{user.username}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <LogOut size={16} /> Logout
            </motion.button>
          </>
        ) : (
          <button
            className="px-4 py-2 rounded-md bg-accent text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
