"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function ContactsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Mom", phone: "+91 98765 43210", relation: "Mother" },
    { id: "2", name: "Dad", phone: "+91 98765 43211", relation: "Father" },
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  const addContact = () => {
    if (!name || !phone) return;
    setContacts([...contacts, { id: Date.now().toString(), name, phone, relation }]);
    setName("");
    setPhone("");
    setRelation("");
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-24 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-2">Emergency Contacts</h1>
      <p className="text-gray-500 mb-8">These contacts will be alerted when you trigger SOS or enter a danger zone.</p>

      <div className="space-y-3 mb-10">
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-semibold">{c.name}</p>
              <p className="text-gray-400 text-sm">{c.phone} · {c.relation}</p>
            </div>
            <button onClick={() => removeContact(c.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold">
              Remove
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-gray-600 text-center py-8">No contacts added yet.</p>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-white font-bold text-lg">Add New Contact</h2>
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          placeholder="Relation (e.g. Mother, Friend)"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />
        <button
          onClick={addContact}
          className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all"
        >
          Add Contact
        </button>
      </div>
    </div>
  );
}