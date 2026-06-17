"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Truck, Edit2, Trash2, Check, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ShippingRule {
  id: string;
  name: string;
  minWeight: number;
  maxWeight?: number | null;
  minValue: number;
  maxValue?: number | null;
  price: number;
  days: number;
  active: boolean;
}

const MOCK: ShippingRule[] = [
  { id: "1", name: "Frete Econômico", minWeight: 0, maxWeight: 1, minValue: 0, maxValue: null, price: 990, days: 10, active: true },
  { id: "2", name: "Frete Padrão", minWeight: 0, maxWeight: 5, minValue: 0, maxValue: null, price: 1590, days: 7, active: true },
  { id: "3", name: "Frete Expresso", minWeight: 0, maxWeight: 5, minValue: 0, maxValue: null, price: 2990, days: 3, active: true },
  { id: "4", name: "Frete Grátis", minWeight: 0, maxWeight: null, minValue: 19900, maxValue: null, price: 0, days: 7, active: true },
];

const emptyForm = {
  name: "", minWeight: "0", maxWeight: "", minValue: "0", maxValue: "", price: "", days: "7",
};

const inputClass = "w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]";

export default function AdminShipping({ rules: propRules }: { rules: ShippingRule[] }) {
  const [rules, setRules] = useState<ShippingRule[]>(propRules.length > 0 ? propRules : MOCK);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditId(null); setModal(true); };
  const openEdit = (r: ShippingRule) => {
    setForm({
      name: r.name,
      minWeight: r.minWeight.toString(),
      maxWeight: r.maxWeight?.toString() ?? "",
      minValue: (r.minValue / 100).toFixed(2),
      maxValue: r.maxValue ? (r.maxValue / 100).toFixed(2) : "",
      price: (r.price / 100).toFixed(2),
      days: r.days.toString(),
    });
    setEditId(r.id);
    setModal(true);
  };

  const handleSave = () => {
    const rule: ShippingRule = {
      id: editId ?? Date.now().toString(),
      name: form.name,
      minWeight: parseFloat(form.minWeight) || 0,
      maxWeight: form.maxWeight ? parseFloat(form.maxWeight) : null,
      minValue: Math.round(parseFloat(form.minValue) * 100) || 0,
      maxValue: form.maxValue ? Math.round(parseFloat(form.maxValue) * 100) : null,
      price: Math.round(parseFloat(form.price) * 100) || 0,
      days: parseInt(form.days) || 7,
      active: true,
    };
    if (editId) {
      setRules((prev) => prev.map((r) => r.id === editId ? rule : r));
    } else {
      setRules((prev) => [rule, ...prev]);
    }
    setModal(false);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Frete</h1>
          <p className="text-[#999] text-sm">Gerencie as regras de frete da loja</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(98,41,157,0.25)]">
          <Plus className="w-4 h-4" />
          Nova regra
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {rules.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#f0f0f0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${r.price === 0 ? "bg-[#f5f5f5]" : "bg-[#edf4ff]"}`}>
                  <Truck className={`w-5 h-5 ${r.price === 0 ? "text-[#1a1a1a]" : "text-[#2563eb]"}`} />
                </div>
                <div>
                  <p className="font-semibold text-[#111]">{r.name}</p>
                  <p className={`text-lg font-black mt-0.5 ${r.price === 0 ? "text-[#1a1a1a]" : "text-[#111]"}`}>
                    {r.price === 0 ? "Grátis" : formatPrice(r.price)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(r)} className="p-1.5 text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setRules((prev) => prev.filter((x) => x.id !== r.id))} className="p-1.5 text-[#bbb] hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-3">
                <p className="text-xs text-[#bbb] mb-1">Prazo</p>
                <p className="font-semibold text-[#111]">{r.days} dias úteis</p>
              </div>
              <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-3">
                <p className="text-xs text-[#bbb] mb-1">Pedido mínimo</p>
                <p className="font-semibold text-[#111]">{r.minValue > 0 ? formatPrice(r.minValue) : "—"}</p>
              </div>
              {r.maxWeight && (
                <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-3">
                  <p className="text-xs text-[#bbb] mb-1">Peso máx.</p>
                  <p className="font-semibold text-[#111]">{r.maxWeight} kg</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/30 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#f0f0f0] rounded-2xl w-full max-w-md z-50 shadow-[0_24px_64px_rgba(98,41,157,0.15)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#f0f0f0]">
                <h2 className="font-bold text-[#111]">{editId ? "Editar regra" : "Nova regra de frete"}</h2>
                <button onClick={() => setModal(false)} className="p-2 text-[#bbb] hover:text-[#1a1a1a] rounded-lg hover:bg-[#f5f5f5] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-[#999] mb-1.5">Nome da modalidade *</label>
                  <input value={form.name} onChange={set("name")} placeholder="Frete Padrão" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "price", label: "Preço (R$) *", placeholder: "15.90" },
                    { field: "days", label: "Prazo (dias úteis) *", placeholder: "7" },
                    { field: "minValue", label: "Pedido mínimo (R$)", placeholder: "0" },
                    { field: "maxValue", label: "Pedido máximo (R$)", placeholder: "Sem limite" },
                    { field: "minWeight", label: "Peso mínimo (kg)", placeholder: "0" },
                    { field: "maxWeight", label: "Peso máximo (kg)", placeholder: "Sem limite" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                      <input value={form[field as keyof typeof form]} onChange={set(field)} placeholder={placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-[#f0f0f0]">
                <button onClick={() => setModal(false)} className="px-5 py-2.5 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:border-[#aaaaaa] transition-colors">Cancelar</button>
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-2.5 rounded-xl transition-colors">
                  <Check className="w-4 h-4" />
                  {editId ? "Salvar" : "Criar regra"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
