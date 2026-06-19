"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, Copy } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { createCoupon, updateCoupon, deleteCoupon } from "@/lib/admin-actions";

interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  type: string;
  value: number;
  minOrder: number;
  maxUses?: number | null;
  uses: number;
  active: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
}

const MOCK: Coupon[] = [
  { id: "1", code: "ELLEBASIC10", description: "10% de desconto", type: "percent", value: 10, minOrder: 0, maxUses: null, uses: 0, active: true, expiresAt: null, createdAt: new Date("2025-01-01") },
];

const emptyForm = { code: "", description: "", type: "percent", value: "", minOrder: "0", maxUses: "", expiresAt: "" };
const inputClass = "w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]";

export default function AdminCoupons({ coupons: propCoupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [coupons, setCoupons] = useState<Coupon[]>(propCoupons.length > 0 ? propCoupons : MOCK);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMock = propCoupons.length === 0;

  const openNew = () => { setForm(emptyForm); setEditId(null); setModal(true); setError(null); };
  const openEdit = (c: Coupon) => {
    setForm({
      code: c.code, description: c.description ?? "",
      type: c.type,
      value: c.type === "fixed" ? (c.value / 100).toFixed(2) : c.value.toString(),
      minOrder: (c.minOrder / 100).toFixed(2),
      maxUses: c.maxUses?.toString() ?? "",
      expiresAt: c.expiresAt ? c.expiresAt.toISOString().split("T")[0] : "",
    });
    setEditId(c.id);
    setModal(true);
    setError(null);
  };

  const buildData = () => ({
    code: form.code.toUpperCase(),
    description: form.description || null,
    type: form.type,
    value: form.type === "fixed" ? Math.round(parseFloat(form.value) * 100) : parseFloat(form.value) || 0,
    minOrder: Math.round(parseFloat(form.minOrder) * 100) || 0,
    maxUses: form.maxUses ? parseInt(form.maxUses) : null,
    active: true,
    expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
  });

  const handleSave = () => {
    if (!form.code) return;
    const data = buildData();

    if (isMock) {
      const coupon: Coupon = { id: Date.now().toString(), uses: 0, createdAt: new Date(), ...data };
      if (editId) {
        setCoupons((prev) => prev.map((c) => c.id === editId ? { ...c, ...data } : c));
      } else {
        setCoupons((prev) => [coupon, ...prev]);
      }
      setModal(false);
      return;
    }

    startTransition(async () => {
      try {
        if (editId) {
          await updateCoupon(editId, data);
          setCoupons((prev) => prev.map((c) => c.id === editId ? { ...c, ...data } : c));
        } else {
          const created = await createCoupon(data);
          setCoupons((prev) => [{ ...created, uses: 0 }, ...prev]);
        }
        router.refresh();
        setModal(false);
      } catch {
        setError("Erro ao salvar cupom.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (isMock) { setCoupons((prev) => prev.filter((c) => c.id !== id)); return; }
    startTransition(async () => {
      try {
        await deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } catch {
        setError("Erro ao excluir cupom.");
      }
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const typeLabel = (c: Coupon) =>
    c.type === "percent" ? `${c.value}% OFF` : c.type === "fixed" ? `-${formatPrice(c.value)}` : "Frete grátis";

  return (
    <div className="space-y-6">
      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          Modo demonstração — conecte um banco de dados para persistir alterações.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Cupons</h1>
          <p className="text-[#999] text-sm">{coupons.length} cupons cadastrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <Plus className="w-4 h-4" />
          Novo cupom
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-white border rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${c.active ? "border-[#f0f0f0]" : "border-[#f0f0f0] opacity-60"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyCode(c.code)} className="flex items-center gap-2 font-mono font-bold text-lg text-[#1a1a1a] hover:text-[#000000] transition-colors group">
                    {c.code}
                    {copied === c.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                </div>
                {c.description && <p className="text-sm text-[#999] mt-0.5">{c.description}</p>}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(c)} className="p-1.5 text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c.id)} disabled={isPending} className="p-1.5 text-[#bbb] hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-[#f5f5f5] text-[#1a1a1a] text-sm font-bold rounded-full">{typeLabel(c)}</span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${c.active ? "bg-emerald-50 text-emerald-600" : "bg-[#f0f0f0] text-[#bbb]"}`}>{c.active ? "Ativo" : "Inativo"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-2">
                <p className="text-xs text-[#bbb]">Usos</p>
                <p className="font-bold text-sm text-[#111]">{c.uses}{c.maxUses ? `/${c.maxUses}` : ""}</p>
              </div>
              <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-2">
                <p className="text-xs text-[#bbb]">Mínimo</p>
                <p className="font-bold text-sm text-[#111]">{c.minOrder > 0 ? formatPrice(c.minOrder) : "—"}</p>
              </div>
              <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-2">
                <p className="text-xs text-[#bbb]">Expira</p>
                <p className="font-bold text-sm text-[#111]">{c.expiresAt ? formatDate(c.expiresAt) : "Nunca"}</p>
              </div>
            </div>
            {c.maxUses && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#bbb] mb-1">
                  <span>Progresso de uso</span>
                  <span className="text-[#1a1a1a] font-semibold">{Math.round((c.uses / c.maxUses) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a1a1a] rounded-full transition-all" style={{ width: `${Math.min((c.uses / c.maxUses) * 100, 100)}%` }} />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/30 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#f0f0f0] rounded-2xl w-full max-w-md z-50 shadow-[0_24px_64px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between p-5 border-b border-[#f0f0f0]">
                <h2 className="font-bold text-[#111]">{editId ? "Editar cupom" : "Novo cupom"}</h2>
                <button onClick={() => setModal(false)} className="p-2 text-[#bbb] hover:text-[#1a1a1a] rounded-lg hover:bg-[#f5f5f5] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { field: "code", label: "Código *", placeholder: "ELLEBASIC10" },
                  { field: "description", label: "Descrição", placeholder: "10% de desconto para novos clientes" },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                    <input value={form[field as keyof typeof form]} onChange={set(field)} placeholder={placeholder} className={inputClass} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">Tipo *</label>
                    <select value={form.type} onChange={set("type")} className={inputClass}>
                      <option value="percent">Porcentagem (%)</option>
                      <option value="fixed">Valor fixo (R$)</option>
                      <option value="shipping">Frete grátis</option>
                    </select>
                  </div>
                  {form.type !== "shipping" && (
                    <div>
                      <label className="block text-xs text-[#999] mb-1.5">Valor *</label>
                      <input value={form.value} onChange={set("value")} placeholder={form.type === "percent" ? "10" : "20.00"} className={inputClass} />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">Pedido mínimo (R$)</label>
                    <input value={form.minOrder} onChange={set("minOrder")} placeholder="0" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">Máx. de usos</label>
                    <input value={form.maxUses} onChange={set("maxUses")} placeholder="Ilimitado" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">Expira em</label>
                    <input type="date" value={form.expiresAt} onChange={set("expiresAt")} className={inputClass} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-[#f0f0f0]">
                <button onClick={() => setModal(false)} className="px-5 py-2.5 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:border-[#aaaaaa] transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                  <Check className="w-4 h-4" />
                  {isPending ? "Salvando..." : editId ? "Salvar" : "Criar cupom"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
