"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";

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
      const catsRes = await fetch(`${API_BASE_URL}/admin/menu-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catsJson = await catsRes.json();

      // Fetch menu items
      const itemsRes = await fetch(`${API_BASE_URL}/admin/menu-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemsJson = await itemsRes.json();

      if (!catsRes.ok || !itemsRes.ok) {
        setError(catsJson.error?.message || itemsJson.error?.message || "Erreur de chargement des données.");
      } else {
        setCategories(catsJson.data || []);
        const sorted = (itemsJson.data || []).sort(
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
        ? `${API_BASE_URL}/admin/menu-items/${editingId}`
        : `${API_BASE_URL}/admin/menu-items`;
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
      const res = await fetch(`${API_BASE_URL}/admin/menu-items/${id}`, {
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

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/40 transition-colors";
  const labelClass = "block text-[10px] tracking-[0.3em] uppercase font-body text-[#c9a96e]/70 mb-2";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#c9a96e]/15">
        <div>
          <h1 className="font-body font-medium text-3xl text-[#f0e8d8]">Carte &amp; Plats</h1>
          <p className="text-xs text-[#f0e8d8]/55 font-body mt-1">
            Chaque plat appartient à une section de la carte (ex: Entrées, Plats, Desserts). Les slugs sont gérés automatiquement.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-[#c9a96e] text-[#0b0b09] text-xs tracking-wider uppercase font-body font-semibold hover:bg-[#dbbe86] transition-colors cursor-pointer border-0"
        >
          + Ajouter un Plat
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-[#f0e8d8]/40 animate-pulse text-sm text-center py-20 font-body">Chargement de la carte...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#c9a96e]/20 bg-[#141412]/50 font-body">
          <p className="text-[#f0e8d8]/40 text-sm">Aucun plat trouvé. Créez des sections de la carte puis ajoutez des plats pour composer votre carte.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#c9a96e]/15 bg-[#141412] shadow-md">
          <table className="w-full text-left border-collapse font-body text-sm">
            <thead>
              <tr className="border-b border-[#c9a96e]/15 text-[10px] tracking-widest uppercase text-[#c9a96e]/85">
                <th className="py-4 px-6 font-semibold">Ordre</th>
                <th className="py-4 px-6 font-semibold">Nom &amp; Description</th>
                <th className="py-4 px-6 font-semibold">Section de la carte</th>
                <th className="py-4 px-6 font-semibold">Prix</th>
                <th className="py-4 px-6 font-semibold">Allergènes / Infos</th>
                <th className="py-4 px-6 font-semibold">Disponibilité</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a96e]/10 text-[#f0e8d8]/80">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#1a1a17]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#c9a96e]">{item.displayOrder}</td>
                  <td className="py-4 px-6 max-w-sm">
                    <div className="font-semibold text-base text-[#f0e8d8]">{item.name}</div>
                    {item.description && <div className="text-xs text-[#f0e8d8]/50 mt-1 leading-relaxed font-light">{item.description}</div>}
                  </td>
                  <td className="py-4 px-6 font-semibold text-sm">
                    {item.category ? item.category.name : <span className="text-[#f0e8d8]/30">Inconnue</span>}
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#c9a96e]">{(item.priceCents / 100).toFixed(2)} €</td>
                  <td className="py-4 px-6 space-y-1 max-w-xs">
                    {item.allergenInfo && (
                      <div className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 inline-block rounded-sm">
                        Allergènes : {item.allergenInfo}
                      </div>
                    )}
                    {item.dietaryInfo && (
                      <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 inline-block rounded-sm block">
                        Infos : {item.dietaryInfo}
                      </div>
                    )}
                    {!item.allergenInfo && !item.dietaryInfo && (
                      <span className="text-[#f0e8d8]/30 text-xs">Aucune</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[9px] tracking-wider uppercase px-2.5 py-0.5 font-semibold ${
                      item.availability === "disponible"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {item.availability}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs uppercase tracking-wider text-[#c9a96e] hover:text-[#dbbe86] font-semibold cursor-pointer border-0 bg-transparent"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
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

      {/* Modal Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#141412] border border-[#c9a96e]/20 shadow-xl p-8 relative my-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-2xl text-[#f0e8d8]/55 hover:text-[#f0e8d8] font-light cursor-pointer bg-transparent border-0"
              aria-label="Fermer"
            >
              &times;
            </button>
            <h2 className="font-body font-medium text-2xl text-[#f0e8d8] mb-6">
              {editingId ? "Modifier le Plat" : "Ajouter un Plat"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="item-cat" className={labelClass}>Section de la carte *</label>
                <select
                  id="item-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className={`${inputClass} bg-[#1e1e1b] cursor-pointer`}
                >
                  <option value="" disabled>Sélectionnez la section de la carte</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#f0e8d8]/35 font-body block mt-1">Sélectionnez la section de la carte (ex: Entrées, Plats, Desserts) à laquelle appartient ce plat.</span>
                {validationErrors.categoryId && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.categoryId}</p>}
              </div>

              <div>
                <label htmlFor="item-name" className={labelClass}>Nom du plat *</label>
                <input
                  id="item-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ex: Filet de Bar rôti, Burger de La Loge"
                  className={inputClass}
                />
                {validationErrors.name && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="item-desc" className={labelClass}>Description / Ingrédients</label>
                <textarea
                  id="item-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Garniture, cuisson, origine des produits..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                {validationErrors.description && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="item-price" className={labelClass}>Prix (€) *</label>
                  <input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceDecimal}
                    onChange={(e) => setPriceDecimal(e.target.value)}
                    required
                    className={inputClass}
                  />
                  {validationErrors.priceCents && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.priceCents}</p>}
                </div>

                <div>
                  <label htmlFor="item-order" className={labelClass}>Ordre d&apos;affichage *</label>
                  <input
                    id="item-order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    required
                    min={1}
                    className={inputClass}
                  />
                  {validationErrors.displayOrder && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.displayOrder}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="item-allergens" className={labelClass}>Allergènes</label>
                <input
                  id="item-allergens"
                  type="text"
                  value={allergenInfo}
                  onChange={(e) => setAllergenInfo(e.target.value)}
                  placeholder="ex: Gluten, Lactose (laisser vide si aucun)"
                  className={inputClass}
                />
                {validationErrors.allergenInfo && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.allergenInfo}</p>}
              </div>

              <div>
                <label htmlFor="item-dietary" className={labelClass}>Infos diététiques</label>
                <input
                  id="item-dietary"
                  type="text"
                  value={dietaryInfo}
                  onChange={(e) => setDietaryInfo(e.target.value)}
                  placeholder="ex: Végétarien, Sans alcool, Bio"
                  className={inputClass}
                />
                {validationErrors.dietaryInfo && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.dietaryInfo}</p>}
              </div>

              <div>
                <label htmlFor="item-avail" className={labelClass}>Disponibilité</label>
                <select
                  id="item-avail"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as "disponible" | "indisponible")}
                  className={`${inputClass} bg-[#1e1e1b] cursor-pointer`}
                >
                  <option value="disponible">Disponible</option>
                  <option value="indisponible">Indisponible</option>
                </select>
                {validationErrors.availability && <p className="text-red-400 text-[11px] font-body mt-1">{validationErrors.availability}</p>}
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
