"use client";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "🆘",
    title: "One-Tap SOS",
    description: "Press once and instant alerts fire to your saved contacts and the nearest police station simultaneously. No delay, no extra steps.",
    tag: "Emergency",
    href: "/dashboard",
  },
  {
    icon: "⚠️",
    title: "Danger Zone Alerts",
    description: "Powered by CSV crime data. The moment you enter a flagged area, you and your contacts get an instant alert automatically.",
    tag: "Live Data",
    href: "/crime-zones",
  },
  {
    icon: "🗺️",
    title: "Shortest Safe Path",
    description: "Instantly calculates the fastest route to the nearest metro station, police station, or bus stop from wherever you are.",
    tag: "Navigation",
    href: "/dashboard",
  },
  {
    icon: "👥",
    title: "Trusted Contacts",
    description: "Save your people. Every alert reaches your full contact list automatically with no manual action needed from you.",
    tag: "Contacts",
    href: "/contacts",
  },
  {
    icon: "📡",
    title: "Live Location Share",
    description: "Your live location is shared with saved contacts during any active alert so they always know exactly where you are.",
    tag: "Tracking",
    href: "/dashboard",
  },
  {
    icon: "🚔",
    title: "Nearest Police Station",
    description: "Automatically detects and routes you to the closest police station with live distance and estimated arrival time.",
    tag: "Safety",
    href: "/crime-zones",
  },
];

export function Features() {
  const router = useRouter();

  return (
    <section id="features" className="bg-[#0a0a0f] py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
            What SafeSakhi Does
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 leading-tight">
            Built for the moments <br />
            <span className="text-red-400">that matter most</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every feature is designed around one goal — keeping you safe, fast, and connected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => router.push(feature.href)}
              className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all duration-300 cursor-pointer hover:bg-white/10"
            >
              <div className="text-4xl mb-5">{feature.icon}</div>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                {feature.tag}
              </span>
              <h3 className="text-white text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border border-red-500/20 bg-red-500/5">
            <p className="text-white text-xl font-bold">Ready to stay safe?</p>
            <p className="text-gray-500 text-sm max-w-sm">
              Set up your contacts, enable location, and SafeSakhi watches over you automatically.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-full transition-all duration-200"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
