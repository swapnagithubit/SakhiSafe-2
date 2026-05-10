"use client";
import { useState } from "react";

export function SOSButton() {
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSOS = () => {
    if (triggered) return;
    setTriggered(true);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        alert("SOS Alert Sent! Your emergency contacts and nearby police station have been notified with your location.");
        setTriggered(false);
        setCountdown(3);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleSOS}
        disabled={triggered}
        className={`relative w-36 h-36 rounded-full font-black text-white text-2xl shadow-2xl transition-all duration-200 ${triggered ? "bg-red-700 scale-95 cursor-not-allowed" : "bg-red-500 hover:bg-red-400 hover:scale-105 active:scale-95"}`}
      >
        {triggered ? (
          <span className="text-4xl font-black">{countdown}</span>
        ) : (
          "SOS"
        )}
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-30" />
      </button>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        {triggered ? "Sending alert to your contacts..." : "Press to send emergency alert to your contacts and nearest police station"}
      </p>
    </div>
  );
}
