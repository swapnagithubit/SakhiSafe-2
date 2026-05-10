"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const crimeData = [
  { city: "Agra", risk: "Orange", total: 764, score: 37.62 },
  { city: "Ahmedabad", risk: "Red", total: 1817, score: 36.76 },
  { city: "Bangalore", risk: "Orange", total: 3588, score: 37.93 },
  { city: "Bhopal", risk: "Orange", total: 690, score: 37.75 },
  { city: "Chennai", risk: "Red", total: 2493, score: 36.94 },
  { city: "Delhi", risk: "Red", total: 5400, score: 36.9 },
  { city: "Faridabad", risk: "Orange", total: 354, score: 37.46 },
  { city: "Ghaziabad", risk: "Orange", total: 704, score: 38.04 },
  { city: "Hyderabad", risk: "Orange", total: 2881, score: 37.77 },
  { city: "Indore", risk: "Red", total: 699, score: 36.37 },
  { city: "Jaipur", risk: "Orange", total: 1479, score: 37.82 },
  { city: "Kolkata", risk: "Orange", total: 2518, score: 37.69 },
  { city: "Lucknow", risk: "Orange", total: 1456, score: 37.62 },
  { city: "Mumbai", risk: "Orange", total: 4415, score: 37.27 },
  { city: "Pune", risk: "Orange", total: 2212, score: 38.65 },
];

const MAX_RESULTS = 3;

const PLACE_TYPES = [
  {
    key: "metro",
    label: "Metro Station",
    icon: "🚇",
    color: "#3B82F6",
    radius: 3000,
    filter: (tags: any) => {
      if (!tags) return false;
      return (
        tags.railway === "station" &&
        (
          tags.station === "subway" ||
          tags.subway === "yes" ||
          (tags.name || "").toLowerCase().includes("metro")
        )
      );
    },
  },

  {
    key: "bus",
    label: "Bus Stop",
    icon: "🚌",
    color: "#F59E0B",
    radius: 2000,
    filter: (tags: any) =>
      tags?.highway === "bus_stop",
  },

  {
    key: "police",
    label: "Police Station",
    icon: "👮",
    color: "#EF4444",
    radius: 5000,
    filter: (tags: any) =>
      tags?.amenity === "police",
  },

  {
    key: "hospital",
    label: "Hospital",
    icon: "🏥",
    color: "#10B981",
    radius: 5000,
    filter: (tags: any) =>
      tags?.amenity === "hospital" ||
      tags?.amenity === "clinic",
  },
];

interface NearbyPlace {
  name: string;
  lat: number;
  lon: number;
  distance: number;
  label: string;
  icon: string;
  color: string;
  key: string;
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;

  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

function speak(text: string) {
  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function playAlarm() {
  const audio = new Audio(
    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
  );

  audio.volume = 1;
  audio.play();

  setTimeout(() => {
    audio.pause();
  }, 5000);
}

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function buildOverpassQuery(
  lat: number,
  lon: number
) {
  return `[out:json][timeout:25];
(
node["railway"="station"](around:3000,${lat},${lon});
node["highway"="bus_stop"](around:2000,${lat},${lon});
node["amenity"="police"](around:5000,${lat},${lon});
node["amenity"="hospital"](around:5000,${lat},${lon});
node["amenity"="clinic"](around:5000,${lat},${lon});
);
out;`;
}

async function fetchOverpass(
  lat: number,
  lon: number
) {
  const query = buildOverpassQuery(lat, lon);

  for (const mirror of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(mirror, {
        method: "POST",
        body: query,
      });

      if (!res.ok) continue;

      return await res.json();
    } catch {}
  }

  throw new Error("Overpass failed");
}

export default function CrimeZonesPage() {
  const [selectedCity, setSelectedCity] =
    useState("");

  const [nearestPlaces, setNearestPlaces] =
    useState<NearbyPlace[]>([]);

  const [userLocation, setUserLocation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [dangerAlert, setDangerAlert] =
    useState(false);

  const [dangerMessage, setDangerMessage] =
    useState("");

  const mapRef = useRef<any>(null);
  const mapObj = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => alert("Location access denied"),
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  useEffect(() => {
    if (document.getElementById("leaflet-css"))
      return;

    const link = document.createElement("link");

    link.id = "leaflet-css";
    link.rel = "stylesheet";

    link.href =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    document.head.appendChild(link);

    const script =
      document.createElement("script");

    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    script.onload = () => {
      leafletRef.current = (window as any).L;
    };

    document.body.appendChild(script);
  }, []);

  const autoDangerAlert = async () => {
    if (!userLocation) return;

    try {
      const liveLocationLink =
        `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lon}`;

      await fetch(
        "http://localhost:5000/send-alert",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            contacts: [
              "+919876543210",
              "+919999999999",
            ],
            location: liveLocationLink,
          }),
        }
      );

      console.log(
        "🚨 Automatic danger alert sent"
      );
    } catch (err) {
      console.log(err);
    }
  };

  const shareLiveLocation = async () => {
    if (!userLocation) {
      alert("Current location not available");
      return;
    }

    try {
      const liveLocationLink =
        `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lon}`;

      const emergencyMessage =
        `🚨 EMERGENCY ALERT 🚨\n\n` +
        `I may be in danger.\n\n` +
        `📍 Live Location:\n${liveLocationLink}`;

      if (navigator.share) {
        navigator.share({
          title: "Emergency Alert",
          text: emergencyMessage,
        });
      }

      const response = await fetch(
        "http://localhost:5000/send-alert",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            contacts: [
              "+919876543210",
              "+919999999999",
            ],
            location: liveLocationLink,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          "🚨 Emergency alerts sent successfully"
        );
      } else {
        alert("❌ Failed to send alerts");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const activateSOS = () => {
    playAlarm();

    speak(
      "Emergency SOS activated. Stay safe."
    );

    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500]);
    }

    setDangerAlert(true);

    setDangerMessage(
      "🚨 EMERGENCY MODE ACTIVATED 🚨"
    );

    autoDangerAlert();

    setTimeout(() => {
      setDangerAlert(false);
    }, 10000);
  };

  const navigateToPlace = (
    place: NearbyPlace
  ) => {
    const mapsUrl =
      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`;

    window.open(
      mapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openCity = useCallback(
    async (cityName: string) => {
      if (!leafletRef.current || !userLocation)
        return;

      setSelectedCity(cityName);
      setLoading(true);

      const cityData = crimeData.find(
        (c) => c.city === cityName
      );

      if (cityData?.risk === "Red") {
        setDangerAlert(true);

        setDangerMessage(
          `🚨 HIGH RISK AREA DETECTED IN ${cityName.toUpperCase()}`
        );

        speak(
          `Warning. You are entering a high risk area in ${cityName}`
        );

        playAlarm();

        autoDangerAlert();

        setTimeout(() => {
          setDangerAlert(false);
        }, 10000);
      }

      const L = leafletRef.current;

      const currentLat = userLocation.lat;
      const currentLon = userLocation.lon;

      try {
        if (!mapObj.current) {
          mapObj.current = L.map(
            mapRef.current
          ).setView(
            [currentLat, currentLon],
            14
          );

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                "© OpenStreetMap",
            }
          ).addTo(mapObj.current);
        } else {
          mapObj.current.setView(
            [currentLat, currentLon],
            14
          );
        }

        mapObj.current.eachLayer(
          (layer: any) => {
            if (
              !(layer instanceof L.TileLayer)
            ) {
              mapObj.current.removeLayer(
                layer
              );
            }
          }
        );

        const userIcon = L.divIcon({
          html: `
          <div style="
            width:28px;
            height:28px;
            background:#2563EB;
            border:4px solid white;
            border-radius:50%;
            box-shadow:0 0 25px #2563EB;
          "></div>
          `,
          className: "",
          iconSize: [28, 28],
        });

        L.marker(
          [currentLat, currentLon],
          {
            icon: userIcon,
          }
        )
          .addTo(mapObj.current)
          .bindPopup("📍 YOU ARE HERE")
          .openPopup();

        const data = await fetchOverpass(
          currentLat,
          currentLon
        );

        const grouped: Record<
          string,
          NearbyPlace[]
        > = {
          metro: [],
          bus: [],
          police: [],
          hospital: [],
        };

        for (const el of data.elements) {
          if (!el.lat || !el.lon)
            continue;

          for (const type of PLACE_TYPES) {
            if (!type.filter(el.tags))
              continue;

            const distance = haversine(
              currentLat,
              currentLon,
              el.lat,
              el.lon
            );

            if (distance > type.radius)
              continue;

            grouped[type.key].push({
              name:
                el.tags?.name ||
                type.label,
              lat: el.lat,
              lon: el.lon,
              distance,
              label: type.label,
              icon: type.icon,
              color: type.color,
              key: type.key,
            });

            break;
          }
        }

        const finalPlaces: NearbyPlace[] =
          [];

        for (const key of Object.keys(
          grouped
        )) {
          const sorted = grouped[
            key
          ].sort(
            (a, b) =>
              a.distance - b.distance
          );

          finalPlaces.push(
            ...sorted.slice(
              0,
              MAX_RESULTS
            )
          );
        }

        setNearestPlaces(finalPlaces);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [userLocation]
  );

  return (
    <div className="min-h-screen bg-black text-white">

      {dangerAlert && (
        <div className="fixed inset-0 z-[9999] bg-red-700/90 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-8xl animate-bounce">
              🚨
            </div>

            <h1 className="text-5xl font-black mt-6 animate-pulse">
              {dangerMessage}
            </h1>

            <button
              onClick={() =>
                setDangerAlert(false)
              }
              className="mt-10 bg-white text-black px-8 py-4 rounded-2xl font-bold"
            >
              CLOSE ALERT
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">
            Smart Crime Safety Map
          </h1>

          <p className="text-zinc-400 text-sm mt-1">
            AI Powered Women Safety System
          </p>
        </div>

        <button
          onClick={activateSOS}
          className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-2xl font-black"
        >
          🚨 SOS
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crimeData.map((city) => (
          <button
            key={city.city}
            onClick={() =>
              openCity(city.city)
            }
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-5 text-left"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">
                {city.city}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  city.risk === "Red"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {city.risk}
              </span>
            </div>

            <p className="text-zinc-400 mt-3">
              Total Crimes: {city.total}
            </p>

            <p className="text-zinc-400">
              Safety Score: {city.score}
            </p>
          </button>
        ))}
      </div>

      <div className="px-6">
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-3xl overflow-hidden border border-zinc-800"
        />
      </div>

      {loading && (
        <div className="text-center py-8 text-blue-400 animate-pulse">
          Searching nearby safety points...
        </div>
      )}

      {!loading &&
        nearestPlaces.length > 0 && (
          <div className="p-6">
            <h2 className="text-3xl font-black mb-8">
              Nearby Safety Points
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {nearestPlaces.map(
                (place, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/10 bg-zinc-900 p-5"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          background:
                            place.color,
                        }}
                      >
                        {place.icon}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">
                          {place.name}
                        </h3>

                        <p className="text-zinc-400">
                          {place.label}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 mb-4">
                      <p className="text-zinc-400">
                        Distance
                      </p>

                      <h2
                        className="text-3xl font-black"
                        style={{
                          color:
                            place.color,
                        }}
                      >
                        {(
                          place.distance /
                          1000
                        ).toFixed(2)}{" "}
                        km
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3">

                      <button
                        onClick={() =>
                          navigateToPlace(
                            place
                          )
                        }
                        className="w-full bg-white text-black py-3 rounded-2xl font-bold"
                      >
                        🧭 Navigate Now
                      </button>

                      <button
                        onClick={
                          shareLiveLocation
                        }
                        className="w-full bg-green-600 py-3 rounded-2xl font-bold"
                      >
                        📍 Share Live Location
                      </button>

                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}