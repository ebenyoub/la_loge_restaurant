"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

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
      const res = await fetch(`${API_BASE_URL}/admin/menu-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Erreur de chargement des catégories.");
      } else {
        const sorted = (json.data || []).sort(
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
    // Auto-generate slug from name (replace spaces and accents, keep alphanumeric and hyphens)
    const generated = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
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
        ? `${API_BASE_URL}/admin/menu-categories/${editingId}`
        : `${API_BASE_URL}/admin/menu-categories`;
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
      const res = await fetch(`${API_BASE_URL}/admin/menu-categories/${id}`, {
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

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/40 transition-colors";
  const labelClass = "block text-[10px] tracking-[0.3em] uppercase font-body text-[#c9a96e]/70 mb-2";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#c9a96e]/15">
        <div>
          <h1 className="font-body font-medium text-3xl text-[#f0e8d8]">Sections de la carte</h1>
          <p className="text-xs text-[#f0e8d8]/55 font-body mt-1">Organisez les plats de votre carte en sections distinctes (ex: Entrées, Plats, Desserts).</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-[#c9a96e] text-[#0b0b09] text-xs tracking-wider uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors cursor-pointer border-0"
        >
          + Ajouter une Section
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-[#f0e8d8]/40 animate-pulse text-sm text-center py-20 font-body">Chargement des sections...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#c9a96e]/20 bg-[#141412]/50 font-body">
          <p className="text-[#f0e8d8]/40 text-sm">Aucune section de la carte créée. Cliquez sur le bouton ci-dessus pour commencer.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#c9a96e]/15 bg-[#141412] shadow-md">
          <table className="w-full text-left border-collapse font-body text-sm">
            <thead>
              <tr className="border-b border-[#c9a96e]/15 text-[10px] tracking-widest uppercase text-[#c9a96e]/85">
                <th className="py-4 px-6 font-semibold">Ordre</th>
                <th className="py-4 px-6 font-semibold">Nom</th>
                <th className="py-4 px-6 font-semibold">Slug (URL)</th>
                <th className="py-4 px-6 font-semibold">Description</th>
                <th className="py-4 px-6 font-semibold">Statut</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a96e]/10 text-[#f0e8d8]/80">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#1a1a17]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#c9a96e]">{cat.displayOrder}</td>
                  <td className="py-4 px-6 font-semibold">{cat.name}</td>
                  <td className="py-4 px-6"><code className="bg-[#1e1e1b] px-2 py-1 text-xs border border-[#c9a96e]/10 font-mono text-[#c9a96e]">{cat.slug}</code></td>
                  <td className="py-4 px-6 truncate max-w-xs">{cat.description || <span className="text-[#f0e8d8]/30">Aucune</span>}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[9px] tracking-wider uppercase px-2.5 py-0.5 font-semibold ${
                      cat.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                    }`}>
                      {cat.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="text-xs uppercase tracking-wider text-[#c9a96e] hover:text-[#dbbe86] font-semibold cursor-pointer border-0 bg-transparent"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="text-xs uppercase tracking-wider text-red-400 hover:text-red-300 font-semibold cursor-pointer border-0 bg-transparent"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-lg w-full bg-[#141412] border border-[#c9a96e]/20 shadow-xl p-8 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-2xl text-[#f0e8d8]/55 hover:text-[#f0e8d8] font-light cursor-pointer bg-transparent border-0"
              aria-label="Fermer"
            >
              &times;
            </button>
            <h2 className="font-body font-medium text-2xl text-[#f0e8d8] mb-6">
              {editingId ? "Modifier la Section" : "Créer une Section de la carte"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="cat-name" className={labelClass}>Nom de la section de la carte *</label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="ex: Entrées, Plats chauds, Desserts"
                  className={inputClass}
                />
                {validationErrors.name && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="cat-slug" className={labelClass}>Slug (URL - Généré automatiquement)</label>
                <input
                  id="cat-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="Généré automatiquement"
                  className={`${inputClass} bg-[#11110f] text-[#f0e8d8]/40 border-[#c9a96e]/10 cursor-not-allowed`}
                />
                <span className="text-[10px] text-[#f0e8d8]/35 font-body block mt-1">Ce champ est généré automatiquement. Vous pouvez le modifier si nécessaire.</span>
                {validationErrors.slug && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.slug}</p>}
              </div>

              <div>
                <label htmlFor="cat-desc" className={labelClass}>Description</label>
                <textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brève description de cette section de la carte..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                {validationErrors.description && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <div>
                  <label htmlFor="cat-order" className={labelClass}>Ordre d&apos;affichage *</label>
                  <input
                    id="cat-order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    required
                    min={1}
                    className={inputClass}
                  />
                  {validationErrors.displayOrder && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.displayOrder}</p>}
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    id="cat-active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 bg-[#1e1e1b] border border-[#c9a96e]/20 text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-opacity-25"
                  />
                  <label htmlFor="cat-active" className="text-xs text-[#f0e8d8]/75 select-none font-body">
                    Rendre cette section active
                  </label>
                  {validationErrors.isActive && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.isActive}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#c9a96e]/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-[#1e1e1b] text-[#f0e8d8]/70 hover:text-[#f0e8d8] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#c9a96e]/20"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c9a96e] text-[#0b0b09] text-xs font-semibold uppercase tracking-wider hover:bg-[#dbbe86] transition-colors cursor-pointer border-0"
                >
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
