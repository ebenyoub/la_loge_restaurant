"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchCategories = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch("/api/v1/admin/menu-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur de chargement des catégories.");
      } else {
        const sorted = (json.data.items || []).sort(
          (a: Category, b: Category) => a.displayOrder - b.displayOrder
        );
        setCategories(sorted);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchCategories();
    });
  }, [fetchCategories]);

  // Handle opening form for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  // Handle opening form for Edit
  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setDisplayOrder(category.displayOrder);
    setIsActive(category.isActive);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  // Validate slug regex client side
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      // Auto-generate slug from name (replace spaces and accents, keep alphanumeric and hyphens)
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    const token = localStorage.getItem("admin_token");

    // Client-side quick check
    if (!/^[a-z0-9-_]+$/.test(slug)) {
      setValidationErrors({
        slug: "Le slug doit contenir uniquement des lettres minuscules, chiffres, tirets et underscores.",
      });
      return;
    }

    const payload = {
      name,
      slug,
      description: description.trim() || null,
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      const url = editingId
        ? `/api/v1/admin/menu-categories/${editingId}`
        : "/api/v1/admin/menu-categories";
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
        fetchCategories();
      }
    } catch {
      alert("Erreur réseau lors de la communication avec le serveur.");
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${catName}" ?`)) {
      return;
    }
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/v1/admin/menu-categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error?.message || "Erreur de suppression.");
      } else {
        fetchCategories();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Catégories du Menu</h1>
          <p className={styles.subtitle}>Organisez les plats de votre carte en sections distinctes.</p>
        </div>
        <button onClick={handleOpenCreate} className={styles.btnAdd}>
          + Ajouter une Catégorie
        </button>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {isLoading ? (
        <div className={styles.loader}>Chargement des catégories...</div>
      ) : categories.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucune catégorie créée. Cliquez sur le bouton ci-dessus pour commencer.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ordre</th>
                <th>Nom</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className={styles.colOrder}>{cat.displayOrder}</td>
                  <td className={styles.colName}>{cat.name}</td>
                  <td className={styles.colSlug}><code>{cat.slug}</code></td>
                  <td className={styles.colDesc}>{cat.description || <span className={styles.muted}>Aucune</span>}</td>
                  <td className={styles.colStatus}>
                    <span className={`${styles.badge} ${cat.isActive ? styles.active : styles.inactive}`}>
                      {cat.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className={styles.colActions}>
                    <button onClick={() => handleOpenEdit(cat)} className={styles.btnEdit}>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className={styles.btnDelete}>
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
              <h2>{editingId ? "Modifier la Catégorie" : "Créer une Catégorie"}</h2>
              <button onClick={() => setIsFormOpen(false)} className={styles.btnClose}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="cat-name">Nom de la catégorie</label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="ex: Entrées, Plats chauds, Desserts"
                />
                {validationErrors.name && <p className={styles.fieldError}>{validationErrors.name}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="cat-slug">Slug (URL)</label>
                <input
                  id="cat-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  required
                  placeholder="ex: entrees, desserts-maison"
                />
                <span className={styles.fieldHelp}>Minuscules, chiffres, tirets et underscores uniquement.</span>
                {validationErrors.slug && <p className={styles.fieldError}>{validationErrors.slug}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brève description de cette section de la carte..."
                  rows={3}
                />
                {validationErrors.description && <p className={styles.fieldError}>{validationErrors.description}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="cat-order">Ordre d&apos;affichage</label>
                  <input
                    id="cat-order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    required
                    min={1}
                  />
                  {validationErrors.displayOrder && <p className={styles.fieldError}>{validationErrors.displayOrder}</p>}
                </div>

                <div className={`${styles.field} ${styles.checkboxField}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Rendre cette catégorie active et visible
                  </label>
                  {validationErrors.isActive && <p className={styles.fieldError}>{validationErrors.isActive}</p>}
                </div>
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
