"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check, ChevronDown } from "lucide-react";
import { formatPrice, formatDatetime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { updateOrderStatus, updateOrderTracking } from "@/lib/admin-actions";

interface Order {
  id: string;
  orderNumber: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  trackingCode?: string | null;
  createdAt: Date;
  userName?: string | null;
  userEmail?: string | null;
  itemCount: number;
}

const MOCK: Order[] = [
  { id: "1", orderNumber: 1001, total: 29990, status: "DELIVERED", paymentStatus: "APPROVED", paymentMethod: "PIX", trackingCode: "BR123456789", createdAt: new Date("2025-10-15"), userName: "Lucas Fernandes", userEmail: "lucas@email.com", itemCount: 1 },
  { id: "2", orderNumber: 1002, total: 59980, status: "SHIPPED", paymentStatus: "APPROVED", paymentMethod: "CREDIT", trackingCode: "BR987654321", createdAt: new Date("2025-10-16"), userName: "Mariana Costa", userEmail: "mariana@email.com", itemCount: 2 },
  { id: "3", orderNumber: 1003, total: 29990, status: "PROCESSING", paymentStatus: "APPROVED", paymentMethod: "PIX", trackingCode: null, createdAt: new Date("2025-10-17"), userName: "Rafael Souza", userEmail: "rafael@email.com", itemCount: 1 },
  { id: "4", orderNumber: 1004, total: 29990, status: "PENDING", paymentStatus: "PENDING", paymentMethod: null, trackingCode: null, createdAt: new Date("2025-10-18"), userName: "Camila Rodrigues", userEmail: "camila@email.com", itemCount: 1 },
];

const statusFlow = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrders({ orders: propOrders }: { orders: Order[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orders, setOrders] = useState<Order[]>(propOrders.length > 0 ? propOrders : MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isMock = propOrders.length === 0;

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toString().includes(search) || (o.userName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder((o) => o ? { ...o, status } : o);

    if (isMock) return;

    startTransition(async () => {
      try {
        await updateOrderStatus(id, status);
        router.refresh();
      } catch {
        setError("Erro ao atualizar status.");
      }
    });
  };

  const handleSaveTracking = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, trackingCode: tracking } : o));
    if (selectedOrder?.id === id) setSelectedOrder((o) => o ? { ...o, trackingCode: tracking } : o);

    if (isMock) return;

    startTransition(async () => {
      try {
        await updateOrderTracking(id, tracking);
        router.refresh();
      } catch {
        setError("Erro ao salvar rastreio.");
      }
    });
  };

  const statusCounts = Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => ({
    key, label, count: orders.filter((o) => o.status === key).length,
  }));

  return (
    <div className="space-y-6">
      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          Modo demonstração — conecte um banco de dados para ver pedidos reais.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-[#111]">Pedidos</h1>
        <p className="text-[#999] text-sm">{orders.length} pedidos no total</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${statusFilter === "ALL" ? "bg-[#f5f5f5] text-[#1a1a1a] border-[#aaaaaa]" : "bg-white text-[#999] border-[#e8e8e8] hover:border-[#aaaaaa] hover:text-[#1a1a1a]"}`}>
          Todos ({orders.length})
        </button>
        {statusCounts.filter((s) => s.count > 0).map(({ key, label, count }) => (
          <button key={key} onClick={() => setStatusFilter(key)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${statusFilter === key ? `${ORDER_STATUS_COLORS[key]} border-current` : "bg-white text-[#999] border-[#e8e8e8] hover:border-[#aaaaaa] hover:text-[#1a1a1a]"}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nº pedido ou cliente..." className="w-full bg-white border border-[#f0f0f0] focus:border-[#aaaaaa] rounded-xl pl-11 pr-4 py-3 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb] shadow-[0_1px_4px_rgba(0,0,0,0.04)]" />
      </div>

      <div className="bg-white border border-[#f0f0f0] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#bbb] border-b border-[#f8f7fb] bg-[#faf9fd]">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Pagamento</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-[#f8f7fb] hover:bg-[#faf9fd] transition-colors">
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setSelectedOrder(o); setTracking(o.trackingCode ?? ""); }} className="text-sm font-semibold text-[#1a1a1a] hover:underline">#{o.orderNumber}</button>
                    <p className="text-xs text-[#bbb]">{o.itemCount} {o.itemCount === 1 ? "item" : "itens"}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[#111]">{o.userName ?? "—"}</p>
                    <p className="text-xs text-[#bbb]">{o.userEmail ?? ""}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#111]">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3.5"><span className="text-xs text-[#999]">{o.paymentMethod ?? "—"}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[o.status] ?? "text-[#888] bg-[#f0f0f0]"}`}>
                      {ORDER_STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#bbb]">{formatDatetime(o.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                      <button
                        onClick={() => { const idx = statusFlow.indexOf(o.status); if (idx < statusFlow.length - 1) handleUpdateStatus(o.id, statusFlow[idx + 1]); }}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                        title="Avançar status"
                      >
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/20 z-50" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-[#f0f0f0] z-50 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.08)] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-[#f0f0f0] sticky top-0 bg-white z-10">
                <h2 className="font-bold text-[#111]">Pedido #{selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-[#bbb] hover:text-[#1a1a1a] rounded-lg hover:bg-[#f5f5f5] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-6">
                <div>
                  <p className="text-xs text-[#bbb] font-semibold uppercase tracking-wider mb-3">Status do pedido</p>
                  <div className="flex flex-wrap gap-2">
                    {statusFlow.map((s) => (
                      <button key={s} onClick={() => handleUpdateStatus(selectedOrder.id, s)} disabled={isPending} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedOrder.status === s ? `${ORDER_STATUS_COLORS[s]} border-current` : "border-[#e8e8e8] text-[#999] hover:border-[#aaaaaa] hover:text-[#1a1a1a]"}`}>
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    ))}
                    <button onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")} disabled={isPending} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedOrder.status === "CANCELLED" ? "text-red-400 bg-red-50 border-red-200" : "border-[#e8e8e8] text-[#999] hover:border-red-200 hover:text-red-400"}`}>
                      Cancelado
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#bbb] font-semibold uppercase tracking-wider mb-3">Código de rastreio</p>
                  <div className="flex gap-2">
                    <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="BR123456789BR" className="flex-1 bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]" />
                    <button onClick={() => handleSaveTracking(selectedOrder.id)} disabled={isPending} className="px-4 py-2.5 bg-[#f5f5f5] border border-[#aaaaaa] text-[#1a1a1a] rounded-xl hover:bg-[#efefef] transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedOrder.trackingCode && <p className="text-xs text-[#1a1a1a] mt-1.5 font-medium">✓ {selectedOrder.trackingCode}</p>}
                </div>

                <div>
                  <p className="text-xs text-[#bbb] font-semibold uppercase tracking-wider mb-3">Cliente</p>
                  <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-4 space-y-1">
                    <p className="text-sm font-semibold text-[#111]">{selectedOrder.userName ?? "—"}</p>
                    <p className="text-sm text-[#999]">{selectedOrder.userEmail ?? "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#bbb] font-semibold uppercase tracking-wider mb-3">Resumo financeiro</p>
                  <div className="bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#999]">Total</span>
                      <span className="font-bold text-[#1a1a1a]">{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#999]">Pagamento</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedOrder.paymentStatus === "APPROVED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {selectedOrder.paymentStatus === "APPROVED" ? "Aprovado" : "Pendente"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#999]">Método</span>
                      <span className="text-[#111]">{selectedOrder.paymentMethod ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#999]">Data</span>
                      <span className="text-[#111]">{formatDatetime(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
