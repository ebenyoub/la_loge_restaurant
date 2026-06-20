"use client";

import { useEffect, useState, startTransition, useCallback } from "react";
import styles from "./page.module.css";

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
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

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

      const res = await fetch(`/api/v1/admin/reservations?${query.toString()}`, {
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
      setIsDetailsLoading(true);
      setDetailsError(null);
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`/api/v1/admin/reservations/${selectedId}`, {
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

  const updateStatus = async (newStatus: string) => {
    if (!details) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/v1/admin/reservations/${details.id}/status`, {
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
        // Refresh local details and list
        setSelectedId(null);
        setSelectedId(details.id);
        fetchReservations();
      }
    } catch {
      alert("Erreur de communication.");
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !noteBody.trim()) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/v1/admin/reservations/${details.id}/notes`, {
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
        setNoteBody("");
        // Reload details to show note
        setSelectedId(null);
        setSelectedId(details.id);
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.listSection}>
        <div className={styles.sectionHeader}>
          <h2>Demandes de Réservations</h2>
          <div className={styles.filters}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
            />
          </div>
        </div>

        {isLoading ? (
          <p>Chargement des réservations...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : reservations.length === 0 ? (
          <p>Aucune réservation ne correspond à vos filtres.</p>
        ) : (
          <ul className={styles.reservationsList}>
            {reservations.map((res) => (
              <li
                key={res.id}
                onClick={() => selectReservation(res.id)}
                className={`${styles.resItem} ${selectedId === res.id ? styles.activeItem : ""}`}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.customerName}>{res.customerName}</span>
                  <span className={`${styles.statusLabel} ${styles[res.status]}`}>
                    {res.status.replace("_", " ")}
                  </span>
                </div>
                <div className={styles.itemMeta}>
                  <span>{res.requestedDate} à {res.requestedTime}</span>
                  <span>{res.guestCount} pers.</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.detailSection}>
        {!selectedId ? (
          <div className={styles.detailsPlaceholder}>
            <p>Sélectionnez une demande pour voir les détails et effectuer des actions.</p>
          </div>
        ) : isDetailsLoading ? (
          <p>Chargement des détails de la réservation...</p>
        ) : detailsError ? (
          <p className={styles.errorMessage}>{detailsError}</p>
        ) : details ? (
          <div className={styles.detailsContainer}>
            <div className={styles.detailHeader}>
              <h3>{details.customerName}</h3>
              <span className={`${styles.statusLabel} ${styles[details.status]}`}>
                {details.status.replace("_", " ")}
              </span>
            </div>

            <div className={styles.actionRow}>
              <span>Changer le statut :</span>
              <div className={styles.actionButtons}>
                {details.status !== "en_attente" && (
                  <button onClick={() => updateStatus("en_attente")} className={styles.btnWait}>
                    Mettre en attente
                  </button>
                )}
                {details.status !== "confirmee" && (
                  <button onClick={() => updateStatus("confirmee")} className={styles.btnConfirm}>
                    Confirmer
                  </button>
                )}
                {details.status !== "refusee" && (
                  <button onClick={() => updateStatus("refusee")} className={styles.btnRefuse}>
                    Refuser
                  </button>
                )}
                {details.status !== "annulee" && (
                  <button onClick={() => updateStatus("annulee")} className={styles.btnCancel}>
                    Annuler
                  </button>
                )}
              </div>
            </div>

            <div className={styles.infoCard}>
              <p><strong>E-mail :</strong> {details.email}</p>
              <p><strong>Téléphone :</strong> {details.phone}</p>
              <p><strong>Date & heure :</strong> {details.requestedDate} à {details.requestedTime}</p>
              <p><strong>Couverts :</strong> {details.guestCount}</p>
              {details.occasion && <p><strong>Occasion :</strong> {details.occasion}</p>}
              {details.message && (
                <div className={styles.customerMessage}>
                  <strong>Message du client :</strong>
                  <p>{details.message}</p>
                </div>
              )}
            </div>

            <div className={styles.notesSection}>
              <h4>Notes Internes</h4>
              <form onSubmit={addNote} className={styles.noteForm}>
                <textarea
                  placeholder="Ajouter une note de suivi interne..."
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  rows={3}
                  required
                />
                <button type="submit" className={styles.btnNote}>
                  Ajouter la note
                </button>
              </form>

              {details.notes.length === 0 ? (
                <p>Aucune note de suivi.</p>
              ) : (
                <ul className={styles.notesList}>
                  {details.notes.map((note) => (
                    <li key={note.id} className={styles.noteItem}>
                      <div className={styles.noteMeta}>
                        <strong>{note.author}</strong> · <span>{new Date(note.createdAt).toLocaleString("fr-FR")}</span>
                      </div>
                      <p className={styles.noteBody}>{note.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.historySection}>
              <h4>Historique des statuts</h4>
              <ul className={styles.historyList}>
                {details.statusHistory.map((h) => (
                  <li key={h.id}>
                    Le {new Date(h.createdAt).toLocaleDateString("fr-FR")} : statut changé en{" "}
                    <strong>{h.nextStatus.replace("_", " ")}</strong> par {h.changedBy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
