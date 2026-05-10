"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
      <div
        onClick={() => router.push("/")}
        className="text-white font-black text-xl cursor-pointer"
      >
        Safe<span className="text-red-400">Sakhi</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white text-sm transition-colors">Home</button>
        <button onClick={() => router.push("/crime-zones")} className="text-gray-400 hover:text-white text-sm transition-colors">Crime Zones</button>
        <button onClick={() => router.push("/contacts")} className="text-gray-400 hover:text-white text-sm transition-colors">Contacts</button>
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</button>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-gray-400 text-sm hidden md:block">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-5 py-2 border border-gray-600 hover:border-gray-400 text-gray-300 text-sm font-semibold rounded-full transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 border border-gray-600 hover:border-gray-400 text-gray-300 text-sm font-semibold rounded-full transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-bold rounded-full transition-all duration-200"
            >
              SOS
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
