"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Package,
  X,
  Check,
  Upload,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  stock: number;
  active: boolean;
  featured: boolean;
  sku?: string | null;
  categoryName?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  products: Product[];
  categories: Category[];
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Whey Protein Isolado 900g", slug: "whey-protein-isolado-900g", price: 18990, compareAt: 23990, stock: 45, active: true, featured: true, sku: "LF-WHY-ISO-900", categoryName: "Proteínas", imageUrl: null, createdAt: new Date("2025-09-01") },
  { id: "2", name: "Creatina Monohidratada 300g", slug: "creatina-monohidratada-300g", price: 8990, compareAt: 11990, stock: 30, active: true, featured: false, sku: "LF-CRE-300", categoryName: "Creatina", imageUrl: null, createdAt: new Date("2025-09-10") },
  { id: "3", name: "Pré-Treino Explosion 300g", slug: "pre-treino-explosion-300g", price: 12990, compareAt: 15990, stock: 0, active: true, featured: true, sku: "LF-PRE-EXP-300", categoryName: "Pré-Treino", imageUrl: null, createdAt: new Date("2025-09-15") },
  { id: "4", name: "Camiseta Dry Fit Performance", slug: "camiseta-dry-fit-performance", price: 8990, compareAt: 12990, stock: 80, active: true, featured: false, sku: "LF-CAM-DRY-M", categoryName: "Roupas", imageUrl: null, createdAt: new Date("2025-09-20") },
  { id: "5", name: "BCAA 2:1:1 210 cáps", slug: "bcaa-211-210-caps", price: 6990, compareAt: null, stock: 15, active: false, featured: false, sku: "LF-BCAA-210", categoryName: "Proteínas", imageUrl: null, createdAt: new Date("2025-09-25") },
];

const emptyForm = {
  name: "", slug: "", price: "", compareAt: "", stock: "", sku: "",
  categoryId: "", description: "", weight: "", active: true, featured: false,
};

const inputClass = "w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]";

export default function AdminProducts({ products: propProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(
    propProducts.length > 0 ? propProducts : MOCK_PRODUCTS
  );
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const openNew = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, price: (p.price / 100).toFixed(2),
      compareAt: p.compareAt ? (p.compareAt / 100).toFixed(2) : "",
      stock: p.stock.toString(), sku: p.sku ?? "",
      categoryId: "", description: "", weight: "",
      active: p.active, featured: p.featured,
    });
    setEditId(p.id);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const price = Math.round(parseFloat(form.price) * 100);
    const compareAt = form.compareAt ? Math.round(parseFloat(form.compareAt) * 100) : null;
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, name: form.name, price, compareAt, stock: parseInt(form.stock) || 0, active: form.active, featured: form.featured } : p));
    } else {
      setProducts((prev) => [{
        id: Date.now().toString(), name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        price, compareAt, stock: parseInt(form.stock) || 0,
        active: form.active, featured: form.featured,
        sku: form.sku || null,
        categoryName: categories.find((c) => c.id === form.categoryId)?.name ?? null,
        imageUrl: null, createdAt: new Date(),
      }, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) setProducts((prev) => prev.filter((p) => p.id !== deleteId)); setDeleteId(null); };
  const toggleActive = (id: string) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Produtos</h1>
          <p className="text-[#999] text-sm">{products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(98,41,157,0.25)]"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, SKU..."
          className="w-full bg-white border border-[#f0f0f0] focus:border-[#aaaaaa] rounded-xl pl-11 pr-4 py-3 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#f0f0f0] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#bbb] border-b border-[#f8f7fb] bg-[#faf9fd]">
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Preço</th>
                <th className="px-5 py-3 font-medium">Estoque</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    layout
                    exit={{ opacity: 0 }}
                    className="border-b border-[#f8f7fb] hover:bg-[#faf9fd] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-[#1a1a1a]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111]">{p.name}</p>
                          {p.sku && <p className="text-xs text-[#bbb]">{p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#999]">{p.categoryName ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#111]">{formatPrice(p.price)}</p>
                      {p.compareAt && <p className="text-xs text-[#bbb] line-through">{formatPrice(p.compareAt)}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-amber-500" : "text-[#111]"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.active ? "bg-emerald-50 text-emerald-600" : "bg-[#f0f0f0] text-[#bbb]"}`}>
                          {p.active ? "Ativo" : "Inativo"}
                        </span>
                        {p.featured && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f5f5f5] text-[#1a1a1a]">
                            Destaque
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#bbb]">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toggleActive(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.active ? "text-[#bbb] hover:text-amber-500 hover:bg-amber-50" : "text-[#bbb] hover:text-emerald-500 hover:bg-emerald-50"}`}>
                          {p.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-[#bbb] hover:text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/30 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white border border-[#f0f0f0] rounded-2xl z-50 flex flex-col shadow-[0_24px_64px_rgba(98,41,157,0.15)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#f0f0f0]">
                <h2 className="font-bold text-[#111]">{editId ? "Editar produto" : "Novo produto"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 text-[#bbb] hover:text-[#1a1a1a] rounded-lg hover:bg-[#f5f5f5] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="border-2 border-dashed border-[#e8e8e8] hover:border-[#aaaaaa] rounded-xl p-8 text-center cursor-pointer transition-colors group">
                  <Upload className="w-8 h-8 text-[#ddd] group-hover:text-[#1a1a1a] mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-[#bbb]">Clique para fazer upload de imagens</p>
                  <p className="text-xs text-[#ddd] mt-1">PNG, JPG até 5MB</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { field: "name", label: "Nome *", placeholder: "Whey Protein Isolado 900g", full: true },
                    { field: "slug", label: "Slug (URL)", placeholder: "whey-protein-isolado-900g", full: true },
                    { field: "price", label: "Preço (R$) *", placeholder: "189.90" },
                    { field: "compareAt", label: "Preço de (R$)", placeholder: "239.90" },
                    { field: "stock", label: "Estoque", placeholder: "100" },
                    { field: "sku", label: "SKU", placeholder: "LF-WHY-001" },
                    { field: "weight", label: "Peso (kg)", placeholder: "0.9" },
                  ].map(({ field, label, placeholder, full }) => (
                    <div key={field} className={full ? "md:col-span-2" : ""}>
                      <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                      <input value={form[field as keyof typeof form] as string} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} placeholder={placeholder} className={inputClass} />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">Categoria</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Selecionar...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#999] mb-1.5">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Descrição do produto..."
                    rows={4}
                    className="w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb] resize-none"
                  />
                </div>

                <div className="flex gap-6">
                  {[
                    { field: "active", label: "Ativo" },
                    { field: "featured", label: "Destaque" },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setForm((f) => ({ ...f, [field]: !f[field as keyof typeof f] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative ${form[field as keyof typeof form] ? "bg-[#1a1a1a]" : "bg-[#e8e8e8]"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[field as keyof typeof form] ? "translate-x-6" : "translate-x-1"}`} />
                      </div>
                      <span className="text-sm text-[#888]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-[#f0f0f0]">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:border-[#aaaaaa] transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-2.5 rounded-xl transition-colors">
                  <Check className="w-4 h-4" />
                  {editId ? "Salvar alterações" : "Criar produto"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#f0f0f0] rounded-2xl p-6 w-full max-w-sm z-50 shadow-[0_24px_64px_rgba(0,0,0,0.12)]"
            >
              <h3 className="font-bold text-[#111] mb-2">Excluir produto?</h3>
              <p className="text-sm text-[#999] mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:border-[#aaaaaa] hover:text-[#1a1a1a] transition-colors">
                  Cancelar
                </button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm">
                  Excluir
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
