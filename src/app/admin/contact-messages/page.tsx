"use client";

import { useEffect, useState, startTransition, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

interface ContactMessage {
  id: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  createdAt: string;
}

interface MessageDetails extends ContactMessage {
  message: string;
  handledAt: string | null;
  handledBy: string | null;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<MessageDetails | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append("status", statusFilter);

      const res = await fetch(`${API_BASE_URL}/admin/contact-messages?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur lors de la récupération des messages.");
      } else {
        setMessages(json.data.items);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchMessages();
    });
  }, [fetchMessages]);

  const selectMessage = (id: string) => {
    startTransition(() => {
      setSelectedId(id);
    });
  };

  useEffect(() => {
    if (!selectedId) {
      Promise.resolve().then(() => {
        setDetails(null);
      });
      return;
    }

    const fetchDetails = async () => {
      setIsDetailsLoading(true);
      setDetailsError(null);
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`${API_BASE_URL}/admin/contact-messages/${selectedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          setDetailsError(json.error?.message || "Impossible de récupérer les détails.");
        } else {
          setDetails(json.data);
        }
      } catch {
        setDetailsError("Erreur réseau lors de la récupération du message.");
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [selectedId]);

  const updateStatus = async (newStatus: string) => {
    if (!details) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/contact-messages/${details.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Erreur de changement de statut.");
      } else {
        setSelectedId(null);
        setSelectedId(details.id);
        fetchMessages();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "nouveau":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "lu":
        return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
      case "traite":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "archive":
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const inputClass = "bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-3 py-2 text-xs font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/40 transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      {/* List Section */}
      <div className="border border-[#c9a96e]/15 bg-[#141412] p-6 flex flex-col h-[calc(100vh-140px)] overflow-hidden">
        <div className="mb-6 space-y-4 shrink-0">
          <h2 className="font-display italic text-2xl text-[#f0e8d8]">Messages de Contact</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputClass} w-full cursor-pointer`}
          >
            <option value="">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="lu">Lu</option>
            <option value="traite">Traité</option>
            <option value="archive">Archivé</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-none">
          {isLoading ? (
            <p className="text-sm text-[#f0e8d8]/40 animate-pulse text-center py-10">Chargement...</p>
          ) : error ? (
            <p className="text-xs text-red-400 text-center py-10">{error}</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-[#f0e8d8]/40 text-center py-10">Aucun message de contact trouvé.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => selectMessage(msg.id)}
                className={`p-4 border cursor-pointer transition-all duration-200 ${
                  selectedId === msg.id
                    ? "bg-[#1e1e1b] border-[#c9a96e]/50 shadow-md"
                    : "bg-[#141412] border-[#c9a96e]/10 hover:border-[#c9a96e]/25 hover:bg-[#1a1a17]"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="font-display italic text-sm text-[#f0e8d8] truncate max-w-[180px]">{msg.name}</span>
                  <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 font-body font-semibold ${getStatusBadgeClass(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
                <div className="text-xs text-[#f0e8d8]/80 line-clamp-1 mb-1 font-body">{msg.subject}</div>
                <div className="text-[10px] text-[#f0e8d8]/45 font-body">
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Section */}
      <div className="border border-[#c9a96e]/15 bg-[#141412] p-6 h-[calc(100vh-140px)] overflow-y-auto scrollbar-none">
        {!selectedId ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-sm text-[#f0e8d8]/40 font-body">
              Sélectionnez un message pour voir son contenu et le traiter.
            </p>
          </div>
        ) : isDetailsLoading ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-sm text-[#f0e8d8]/40 font-body animate-pulse">
              Chargement du message...
            </p>
          </div>
        ) : detailsError ? (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
            {detailsError}
          </div>
        ) : details ? (
          <div className="space-y-8">
            {/* Header Details */}
            <div className="border-b border-[#c9a96e]/15 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/80 font-body block mb-1">
                  Sujet du message
                </span>
                <h3 className="font-display italic text-2xl text-[#f0e8d8]">{details.subject}</h3>
                <p className="text-xs text-[#f0e8d8]/55 font-body mt-2">
                  De <strong className="text-[#f0e8d8]">{details.name}</strong> ({details.email})
                  {details.phone && <span> · Tél : {details.phone}</span>}
                </p>
              </div>
              <span className={`text-[10px] tracking-widest uppercase px-3 py-1 font-body font-semibold ${getStatusBadgeClass(details.status)}`}>
                {details.status}
              </span>
            </div>

            {/* Actions Status */}
            <div className="bg-[#1e1e1b] border border-[#c9a96e]/10 p-5 space-y-4">
              <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/80 font-body font-semibold">
                Changer le statut :
              </span>
              <div className="flex flex-wrap gap-3">
                {details.status !== "lu" && (
                  <button
                    onClick={() => updateStatus("lu")}
                    className="px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border border-[#c9a96e]/20 bg-[#141412] text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40 transition-all cursor-pointer"
                  >
                    Marquer Lu
                  </button>
                )}
                {details.status !== "traite" && (
                  <button
                    onClick={() => updateStatus("traite")}
                    className="px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border border-[#c9a96e]/20 bg-[#141412] text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40 transition-all cursor-pointer"
                  >
                    Marquer Traité
                  </button>
                )}
                {details.status !== "archive" && (
                  <button
                    onClick={() => updateStatus("archive")}
                    className="px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border border-[#c9a96e]/20 bg-[#141412] text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40 transition-all cursor-pointer"
                  >
                    Archiver
                  </button>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="border border-[#c9a96e]/10 p-5 bg-[#141412]/40 font-body">
              <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/70 font-semibold mb-3">
                Contenu du Message
              </span>
              <p className="text-sm text-[#f0e8d8]/85 leading-relaxed bg-[#1e1e1b] p-5 border-l-2 border-[#c9a96e]/40 whitespace-pre-wrap">
                {details.message}
              </p>
            </div>

            {/* Handling meta */}
            {details.handledAt && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-body">
                <p>
                  Traité le <strong>{new Date(details.handledAt).toLocaleString("fr-FR")}</strong> par{" "}
                  <strong>{details.handledBy || "Admin"}</strong>.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
