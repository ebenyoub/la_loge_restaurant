"use client";

import { useEffect, useState, startTransition, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

interface Reservation {
  id: string;
  requestedDate: string;
  requestedTime: string;
  customerName: string;
  guestCount: number;
  occasion: string | null;
  status: string;
}

interface Note {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

interface StatusHistory {
  id: string;
  previousStatus: string | null;
  nextStatus: string;
  changedBy: string;
  createdAt: string;
}

interface ReservationDetails extends Reservation {
  phone: string;
  email: string;
  message: string | null;
  statusHistory: StatusHistory[];
  notes: Note[];
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [statusUpdatingTo, setStatusUpdatingTo] = useState<string | null>(null);
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append("status", statusFilter);
      if (dateFilter) query.append("date", dateFilter);

      const res = await fetch(`${API_BASE_URL}/admin/reservations?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur de chargement des réservations.");
      } else {
        setReservations(json.data.items);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchReservations();
    });
  }, [fetchReservations]);

  useEffect(() => {
    const handleNewReservation = () => {
      Promise.resolve().then(() => {
        fetchReservations();
      });
    };
    window.addEventListener("new-reservation", handleNewReservation);
    return () => {
      window.removeEventListener("new-reservation", handleNewReservation);
    };
  }, [fetchReservations]);

  const selectReservation = (id: string) => {
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
      if (!selectedId) return;
      setIsDetailsLoading(true);
      setDetailsError(null);
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`${API_BASE_URL}/admin/reservations/${selectedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          setDetailsError(json.error?.message || "Impossible de charger les détails.");
        } else {
          setDetails(json.data);
        }
      } catch {
        setDetailsError("Erreur serveur lors de la récupération des détails.");
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [selectedId]);

  const promptStatusUpdate = (newStatus: string) => {
    if (!details || statusUpdatingTo) return;
    if (details.status === newStatus) return;
    setPendingStatus(newStatus);
    setShowConfirmModal(true);
  };

  const updateStatus = async (newStatus: string) => {
    if (!details || statusUpdatingTo) return;
    if (details.status === newStatus) return;
    setStatusUpdatingTo(newStatus);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reservations/${details.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Impossible de modifier le statut.");
      } else {
        const changedAt = json.data.statusChangedAt as string;
        const adminName = JSON.parse(localStorage.getItem("admin_user") || "{}").displayName || "Vous";

        setDetails((current) => current && current.id === details.id ? {
          ...current,
          status: json.data.status,
          statusHistory: [
            {
              id: `pending-status-${changedAt}`,
              previousStatus: current.status,
              nextStatus: json.data.status,
              changedBy: adminName,
              createdAt: changedAt,
            },
            ...current.statusHistory,
          ],
        } : current);
        setReservations((current) => current.map((reservation) =>
          reservation.id === details.id ? { ...reservation, status: json.data.status } : reservation
        ));
      }
    } catch {
      alert("Erreur de communication.");
    } finally {
      setStatusUpdatingTo(null);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !noteBody.trim() || isNoteSubmitting) return;
    setIsNoteSubmitting(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reservations/${details.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: noteBody }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Impossible d'ajouter la note.");
      } else {
        const adminName = JSON.parse(localStorage.getItem("admin_user") || "{}").displayName || "Vous";
        setDetails((current) => current && current.id === details.id ? {
          ...current,
          notes: [
            {
              id: json.data.id,
              body: json.data.body,
              author: adminName,
              createdAt: json.data.createdAt,
            },
            ...current.notes,
          ],
        } : current);
        setNoteBody("");
      }
    } catch {
      alert("Erreur réseau.");
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "nouvelle":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "en_attente":
        return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
      case "confirmee":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "refusee":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "annulee":
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
          <h2 className="font-body font-medium text-2xl text-[#f0e8d8]">Réservations</h2>
          <p className="text-[10px] text-[#f0e8d8]/40 font-body leading-normal">
            Conformément au RGPD, les données de réservation sont conservées pour une durée maximale de 3 ans après la date de visite.
          </p>
          <div className="flex flex-col gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClass} w-full cursor-pointer`}
            >
              <option value="">Tous les statuts</option>
              <option value="nouvelle">Nouvelle</option>
              <option value="en_attente">En attente</option>
              <option value="confirmee">Confirmée</option>
              <option value="refusee">Refusée</option>
              <option value="annulee">Annulée</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`${inputClass} w-full [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-none">
          {isLoading ? (
            <p className="text-sm text-[#f0e8d8]/40 animate-pulse text-center py-10">Chargement...</p>
          ) : error ? (
            <p className="text-xs text-red-400 text-center py-10">{error}</p>
          ) : reservations.length === 0 ? (
            <p className="text-xs text-[#f0e8d8]/40 text-center py-10">Aucune demande trouvée.</p>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                onClick={() => selectReservation(res.id)}
                className={`p-4 border cursor-pointer transition-all duration-200 ${
                  selectedId === res.id
                    ? "bg-[#1e1e1b] border-[#c9a96e]/50 shadow-md"
                    : "bg-[#141412] border-[#c9a96e]/10 hover:border-[#c9a96e]/25 hover:bg-[#1a1a17]"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="font-body font-medium text-sm text-[#f0e8d8] truncate max-w-[180px]">{res.customerName}</span>
                  <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 font-body font-semibold ${getStatusBadgeClass(res.status)}`}>
                    {res.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#f0e8d8]/50 font-body">
                  <span>{res.requestedDate} à {res.requestedTime}</span>
                  <span>{res.guestCount} pers.</span>
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
              Sélectionnez une demande pour voir les détails et effectuer des actions.
            </p>
          </div>
        ) : isDetailsLoading ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-sm text-[#f0e8d8]/40 font-body animate-pulse">
              Chargement des détails de la réservation...
            </p>
          </div>
        ) : detailsError ? (
          <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
            {detailsError}
          </div>
        ) : details ? (
          <div className="space-y-8 animate-none">
            {/* Header Details */}
            <div className="border-b border-[#c9a96e]/15 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/80 font-body block mb-1">
                  Détail demande
                </span>
                <h3 className="font-body font-medium text-3xl text-[#f0e8d8]">{details.customerName}</h3>
              </div>
              <span className={`text-[10px] tracking-widest uppercase px-3 py-1 font-body font-semibold ${getStatusBadgeClass(details.status)}`}>
                {details.status.replace("_", " ")}
              </span>
            </div>

            {/* Actions Status */}
            <div className="bg-[#1e1e1b] border border-[#c9a96e]/10 p-5 space-y-4">
              <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/80 font-body font-semibold">
                Actions administratives :
              </span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => promptStatusUpdate("en_attente")}
                  disabled={Boolean(statusUpdatingTo)}
                  className={`px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    details.status === "en_attente"
                      ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-300"
                      : "bg-[#141412] border-[#c9a96e]/20 text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40"
                  }`}
                >
                  {statusUpdatingTo === "en_attente" ? "Mise à jour..." : "Mettre en attente"}
                </button>
                <button
                  onClick={() => promptStatusUpdate("confirmee")}
                  disabled={Boolean(statusUpdatingTo)}
                  className={`px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    details.status === "confirmee"
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                      : "bg-[#141412] border-[#c9a96e]/20 text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40"
                  }`}
                >
                  {statusUpdatingTo === "confirmee" ? "Mise à jour..." : "Confirmer"}
                </button>
                <button
                  onClick={() => promptStatusUpdate("refusee")}
                  disabled={Boolean(statusUpdatingTo)}
                  className={`px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    details.status === "refusee"
                      ? "bg-red-500/20 border-red-500/60 text-red-300"
                      : "bg-[#141412] border-[#c9a96e]/20 text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40"
                  }`}
                >
                  {statusUpdatingTo === "refusee" ? "Mise à jour..." : "Refuser"}
                </button>
                <button
                  onClick={() => promptStatusUpdate("annulee")}
                  disabled={Boolean(statusUpdatingTo)}
                  className={`px-4 py-2 text-[10px] tracking-wider uppercase font-body font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    details.status === "annulee"
                      ? "bg-zinc-800 border-zinc-600 text-zinc-300"
                      : "bg-[#141412] border-[#c9a96e]/20 text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40"
                  }`}
                >
                  {statusUpdatingTo === "annulee" ? "Mise à jour..." : "Annuler"}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#c9a96e]/10 p-5 bg-[#141412]/40 space-y-3 font-body">
                <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/70 font-semibold mb-2">
                  Client &amp; Contact
                </span>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Nom :</strong> {details.customerName}</p>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Email :</strong> {details.email}</p>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Téléphone :</strong> {details.phone}</p>
              </div>

              <div className="border border-[#c9a96e]/10 p-5 bg-[#141412]/40 space-y-3 font-body">
                <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/70 font-semibold mb-2">
                  Réservation
                </span>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Date :</strong> {details.requestedDate}</p>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Heure :</strong> {details.requestedTime}</p>
                <p className="text-sm"><strong className="text-[#c9a96e]/80 font-normal">Couverts :</strong> {details.guestCount} convives</p>
                {details.occasion && (
                  <p className="text-sm">
                    <strong className="text-[#c9a96e]/80 font-normal">Occasion :</strong>{" "}
                    <span className="px-2 py-0.5 bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[11px] text-[#c9a96e]">
                      {details.occasion}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Customer Message */}
            {details.message && (
              <div className="border border-[#c9a96e]/10 p-5 bg-[#141412]/40 font-body">
                <span className="block text-[10px] tracking-widest uppercase text-[#c9a96e]/70 font-semibold mb-3">
                  Message du client :
                </span>
                <p className="text-sm text-[#f0e8d8]/80 leading-relaxed bg-[#1e1e1b] p-4 border-l-2 border-[#c9a96e]/40">
                  &ldquo;{details.message}&rdquo;
                </p>
              </div>
            )}

            {/* Notes Section */}
            <div className="border-t border-[#c9a96e]/10 pt-6 space-y-5">
              <h4 className="text-[11px] tracking-widest uppercase text-[#c9a96e] font-body font-semibold">
                Notes Internes
              </h4>

              <form onSubmit={addNote} className="space-y-3">
                <textarea
                  placeholder="Ajouter une note de suivi interne..."
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  disabled={isNoteSubmitting}
                  rows={3}
                  required
                  className="w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] p-4 text-xs font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/40 transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={isNoteSubmitting || !noteBody.trim()}
                  className="px-5 py-2.5 bg-[#c9a96e] text-[#0b0b09] text-[10px] tracking-widest uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors border-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isNoteSubmitting ? "Ajout en cours..." : "Ajouter la note"}
                </button>
              </form>

              {details.notes.length === 0 ? (
                <p className="text-xs text-[#f0e8d8]/35">Aucune note de suivi.</p>
              ) : (
                <div className="space-y-4">
                  {details.notes.map((note) => (
                    <div key={note.id} className="bg-[#1e1e1b] p-4 border border-[#c9a96e]/5 font-body">
                      <div className="flex justify-between items-center text-[10px] text-[#f0e8d8]/55 mb-2">
                        <strong className="text-[#c9a96e]/80">{note.author}</strong>
                        <span>{new Date(note.createdAt).toLocaleString("fr-FR")}</span>
                      </div>
                      <p className="text-xs text-[#f0e8d8]/85 leading-relaxed">{note.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status History */}
            <div className="border-t border-[#c9a96e]/10 pt-6 space-y-3">
              <h4 className="text-[11px] tracking-widest uppercase text-[#c9a96e] font-body font-semibold">
                Historique des statuts
              </h4>
              <ul className="space-y-2 text-xs text-[#f0e8d8]/65 font-body">
                {details.statusHistory.map((h) => (
                  <li key={h.id} className="flex items-center gap-2 pl-3 border-l border-[#c9a96e]/30">
                    <span>Le {new Date(h.createdAt).toLocaleDateString("fr-FR")} à {new Date(h.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} :</span>
                    <span>Statut modifié en <strong className="text-[#c9a96e] uppercase text-[10px] tracking-wider">{h.nextStatus.replace("_", " ")}</strong> par <span className="underline decoration-dotted">{h.changedBy}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && pendingStatus && details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-[#141412] border border-[#c9a96e]/30 max-w-md w-full p-6 space-y-6">
            <div className="space-y-2 border-b border-[#c9a96e]/15 pb-4">
              <h3 className="font-body font-medium text-lg text-[#f0e8d8]">Confirmer le changement de statut</h3>
              <p className="text-xs text-[#f0e8d8]/55">
                Veuillez valider le nouveau statut de la demande ci-dessous.
              </p>
            </div>

            <div className="space-y-3 text-xs font-body">
              <div className="flex justify-between">
                <span className="text-[#f0e8d8]/40 font-light">Client :</span>
                <span className="text-[#f0e8d8] font-medium">{details.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#f0e8d8]/40 font-light">E-mail :</span>
                <span className="text-[#f0e8d8]">{details.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#f0e8d8]/40 font-light">Statut actuel :</span>
                <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 font-semibold ${getStatusBadgeClass(details.status)}`}>
                  {details.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#f0e8d8]/40 font-light">Nouveau statut :</span>
                <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 font-semibold ${getStatusBadgeClass(pendingStatus)}`}>
                  {pendingStatus.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="bg-amber-500/10 border-l-2 border-amber-500/80 p-3 text-[11px] text-amber-300 font-body">
              ⚠️ <strong>Avertissement :</strong> Un e-mail sera envoyé au client.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingStatus(null);
                }}
                disabled={Boolean(statusUpdatingTo)}
                className="px-4 py-2 border border-[#c9a96e]/20 text-[#f0e8d8]/60 hover:text-[#f0e8d8] hover:border-[#c9a96e]/40 text-xs font-body font-semibold cursor-pointer uppercase tracking-wider"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModal(false);
                  const statusToUpdate = pendingStatus;
                  setPendingStatus(null);
                  await updateStatus(statusToUpdate);
                }}
                disabled={Boolean(statusUpdatingTo)}
                className="px-4 py-2 bg-[#c9a96e] text-[#0b0b09] hover:bg-[#dbbe86] text-xs font-body font-semibold cursor-pointer uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Confirmer l&apos;envoi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
