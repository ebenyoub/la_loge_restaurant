"use client";

import { useEffect, useState, startTransition, useCallback } from "react";
import styles from "./page.module.css";

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

      const res = await fetch(`/api/v1/admin/contact-messages?${query.toString()}`, {
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
        const res = await fetch(`/api/v1/admin/contact-messages/${selectedId}`, {
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
      const res = await fetch(`/api/v1/admin/contact-messages/${details.id}/status`, {
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

  return (
    <div className={styles.container}>
      <div className={styles.listSection}>
        <div className={styles.sectionHeader}>
          <h2>Messages de Contact</h2>
          <div className={styles.filters}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="lu">Lu</option>
              <option value="traite">Traité</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <p>Chargement des messages...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : messages.length === 0 ? (
          <p>Aucun message de contact trouvé.</p>
        ) : (
          <ul className={styles.messagesList}>
            {messages.map((msg) => (
              <li
                key={msg.id}
                onClick={() => selectMessage(msg.id)}
                className={`${styles.msgItem} ${selectedId === msg.id ? styles.activeItem : ""}`}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.customerName}>{msg.name}</span>
                  <span className={`${styles.statusLabel} ${styles[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
                <div className={styles.itemSubject}>{msg.subject}</div>
                <div className={styles.itemDate}>
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.detailSection}>
        {!selectedId ? (
          <div className={styles.detailsPlaceholder}>
            <p>Sélectionnez un message pour voir son contenu et le traiter.</p>
          </div>
        ) : isDetailsLoading ? (
          <p>Chargement du message...</p>
        ) : detailsError ? (
          <p className={styles.errorMessage}>{detailsError}</p>
        ) : details ? (
          <div className={styles.detailsContainer}>
            <div className={styles.detailHeader}>
              <div>
                <h3>{details.subject}</h3>
                <p className={styles.authorMeta}>
                  De <strong>{details.name}</strong> ({details.email})
                  {details.phone && <span> · Tél : {details.phone}</span>}
                </p>
              </div>
              <span className={`${styles.statusLabel} ${styles[details.status]}`}>
                {details.status}
              </span>
            </div>

            <div className={styles.actionRow}>
              <span>Statut du traitement :</span>
              <div className={styles.actionButtons}>
                {details.status !== "lu" && (
                  <button onClick={() => updateStatus("lu")} className={styles.btnRead}>
                    Marquer Lu
                  </button>
                )}
                {details.status !== "traite" && (
                  <button onClick={() => updateStatus("traite")} className={styles.btnProcess}>
                    Marquer Traité
                  </button>
                )}
                {details.status !== "archive" && (
                  <button onClick={() => updateStatus("archive")} className={styles.btnArchive}>
                    Archiver
                  </button>
                )}
              </div>
            </div>

            <div className={styles.messageContentBlock}>
              <h4>Contenu du Message</h4>
              <p className={styles.messageText}>{details.message}</p>
            </div>

            {details.handledAt && (
              <div className={styles.handlingCard}>
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
