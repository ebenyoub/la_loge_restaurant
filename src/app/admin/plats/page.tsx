"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  category: { name: string } | null;
  name: string;
  description: string | null;
  priceCents: number;
  allergenInfo: string | null;
  dietaryInfo: string | null;
  availability: "disponible" | "indisponible";
  displayOrder: number;
}

export default function AdminPlatsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceDecimal, setPriceDecimal] = useState("0.00");
  const [allergenInfo, setAllergenInfo] = useState("");
  const [dietaryInfo, setDietaryInfo] = useState("");
  const [availability, setAvailability] = useState<"disponible" | "indisponible">("disponible");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      // Fetch categories for select dropdown
      const catsRes = await fetch("/api/v1/admin/menu-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catsJson = await catsRes.json();

      // Fetch menu items
      const itemsRes = await fetch("/api/v1/admin/menu-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemsJson = await itemsRes.json();

      if (!catsRes.ok || !itemsRes.ok) {
        setError(catsJson.error?.message || itemsJson.error?.message || "Erreur de chargement des données.");
      } else {
        setCategories(catsJson.data.items || []);
        const sorted = (itemsJson.data.items || []).sort(
          (a: MenuItem, b: MenuItem) => a.displayOrder - b.displayOrder
        );
        setItems(sorted);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchData();
    });
  }, [fetchData]);

  // Open form for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setCategoryId(categories[0]?.id || "");
    setName("");
    setDescription("");
    setPriceDecimal("0.00");
    setAllergenInfo("");
    setDietaryInfo("");
    setAvailability("disponible");
    setDisplayOrder(items.length + 1);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  // Open form for Edit
  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setCategoryId(item.categoryId);
    setName(item.name);
    setDescription(item.description || "");
    setPriceDecimal((item.priceCents / 100).toFixed(2));
    setAllergenInfo(item.allergenInfo || "");
    setDietaryInfo(item.dietaryInfo || "");
    setAvailability(item.availability);
    setDisplayOrder(item.displayOrder);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    const token = localStorage.getItem("admin_token");

    // Convert decimal price string to cents integer
    const parsedPrice = parseFloat(priceDecimal);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setValidationErrors({ priceCents: "Le prix doit être un nombre valide positif." });
      return;
    }
    const priceCents = Math.round(parsedPrice * 100);

    const payload = {
      categoryId,
      name,
      description: description.trim() || null,
      priceCents,
      allergenInfo: allergenInfo.trim() || null,
      dietaryInfo: dietaryInfo.trim() || null,
      availability,
      displayOrder: Number(displayOrder),
    };

    try {
      const url = editingId
        ? `/api/v1/admin/menu-items/${editingId}`
        : "/api/v1/admin/menu-items";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.error?.code === "VALIDATION_ERROR" && json.error.fields) {
          setValidationErrors(json.error.fields);
        } else {
          alert(json.error?.message || "Une erreur est survenue.");
        }
      } else {
        setIsFormOpen(false);
        fetchData();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  // Delete Plat
  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le plat "${itemName}" ?`)) {
      return;
    }
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/v1/admin/menu-items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Erreur lors de la suppression.");
      } else {
        fetchData();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Carte & Plats</h1>
          <p className={styles.subtitle}>Gérez les plats, formules, allergènes et prix affichés sur votre carte.</p>
        </div>
        <button onClick={handleOpenCreate} className={styles.btnAdd}>
          + Ajouter un Plat
        </button>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {isLoading ? (
        <div className={styles.loader}>Chargement de la carte...</div>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucun plat trouvé. Créez des catégories puis ajoutez des plats pour composer votre carte.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ordre</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Allergènes / Infos</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.colOrder}>{item.displayOrder}</td>
                  <td className={styles.colName}>
                    <div className={styles.itemName}>{item.name}</div>
                    {item.description && <div className={styles.itemDesc}>{item.description}</div>}
                  </td>
                  <td className={styles.colCat}>
                    {item.category ? item.category.name : <span className={styles.muted}>Inconnu</span>}
                  </td>
                  <td className={styles.colPrice}>{(item.priceCents / 100).toFixed(2)} €</td>
                  <td className={styles.colMeta}>
                    {item.allergenInfo && (
                      <div className={styles.metaBadge}>Allergènes : {item.allergenInfo}</div>
                    )}
                    {item.dietaryInfo && (
                      <div className={`${styles.metaBadge} ${styles.dietary}`}>Infos : {item.dietaryInfo}</div>
                    )}
                    {!item.allergenInfo && !item.dietaryInfo && (
                      <span className={styles.muted}>Aucune info</span>
                    )}
                  </td>
                  <td className={styles.colAvail}>
                    <span className={`${styles.badge} ${item.availability === "disponible" ? styles.avail : styles.unavail}`}>
                      {item.availability}
                    </span>
                  </td>
                  <td className={styles.colActions}>
                    <button onClick={() => handleOpenEdit(item)} className={styles.btnEdit}>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)} className={styles.btnDelete}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Modifier le Plat" : "Ajouter un Plat"}</h2>
              <button onClick={() => setIsFormOpen(false)} className={styles.btnClose}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="item-cat">Catégorie</label>
                <select
                  id="item-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {validationErrors.categoryId && <p className={styles.fieldError}>{validationErrors.categoryId}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="item-name">Nom du plat</label>
                <input
                  id="item-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ex: Filet de Bar rôti, Crème brûlée"
                />
                {validationErrors.name && <p className={styles.fieldError}>{validationErrors.name}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="item-desc">Description</label>
                <textarea
                  id="item-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Garniture, cuisson, origine des produits..."
                  rows={3}
                />
                {validationErrors.description && <p className={styles.fieldError}>{validationErrors.description}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="item-price">Prix (€)</label>
                  <input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceDecimal}
                    onChange={(e) => setPriceDecimal(e.target.value)}
                    required
                  />
                  {validationErrors.priceCents && <p className={styles.fieldError}>{validationErrors.priceCents}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="item-order">Ordre d&apos;affichage</label>
                  <input
                    id="item-order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    required
                    min={1}
                  />
                  {validationErrors.displayOrder && <p className={styles.fieldError}>{validationErrors.displayOrder}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="item-allergens">Allergènes</label>
                <input
                  id="item-allergens"
                  type="text"
                  value={allergenInfo}
                  onChange={(e) => setAllergenInfo(e.target.value)}
                  placeholder="ex: Gluten, Lactose, Coques (laisser vide si aucun)"
                />
                {validationErrors.allergenInfo && <p className={styles.fieldError}>{validationErrors.allergenInfo}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="item-dietary">Infos diététiques</label>
                <input
                  id="item-dietary"
                  type="text"
                  value={dietaryInfo}
                  onChange={(e) => setDietaryInfo(e.target.value)}
                  placeholder="ex: Végétarien, Bio, Sans alcool"
                />
                {validationErrors.dietaryInfo && <p className={styles.fieldError}>{validationErrors.dietaryInfo}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="item-avail">Disponibilité</label>
                <select
                  id="item-avail"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as "disponible" | "indisponible")}
                >
                  <option value="disponible">Disponible</option>
                  <option value="indisponible">Indisponible</option>
                </select>
                {validationErrors.availability && <p className={styles.fieldError}>{validationErrors.availability}</p>}
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsFormOpen(false)} className={styles.btnCancel}>
                  Annuler
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  {editingId ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
