"use client";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-sm font-medium tracking-widest uppercase">
            Women Safety Platform
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
          Safe<span className="text-red-400">Sakhi</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Your intelligent safety companion. Real-time danger zone alerts, one-tap SOS,
          and always the fastest path to safety — because every second matters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-lg rounded-full transition-all duration-200 flex items-center gap-3"
          >
            <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
            SOS Emergency
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold text-lg rounded-full transition-all duration-200"
          >
            Explore Features
          </button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-gray-800 pt-10">
          <div className="text-center">
            <div className="text-3xl font-black text-red-400 mb-1">3s</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">SOS Alert Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-400 mb-1">24/7</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">Live Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-400 mb-1">100%</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">Always On</div>
          </div>
        </div>
      </div>
    </section>
  );
}
