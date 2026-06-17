"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, QrCode, Barcode } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface FinancialOrder {
  id: string;
  orderNumber: number;
  total: number;
  createdAt: Date;
  paymentMethod?: string | null;
}

interface Props {
  data: {
    orders: FinancialOrder[];
    monthlyData: unknown[];
  };
}

const MOCK_ORDERS: FinancialOrder[] = [
  { id: "1", orderNumber: 1001, total: 18990, createdAt: new Date("2025-10-15"), paymentMethod: "PIX" },
  { id: "2", orderNumber: 1002, total: 35480, createdAt: new Date("2025-10-16"), paymentMethod: "CREDIT" },
  { id: "3", orderNumber: 1003, total: 8990, createdAt: new Date("2025-10-17"), paymentMethod: "PIX" },
  { id: "4", orderNumber: 1005, total: 6990, createdAt: new Date("2025-10-19"), paymentMethod: "BOLETO" },
  { id: "5", orderNumber: 1007, total: 22980, createdAt: new Date("2025-10-20"), paymentMethod: "CREDIT" },
  { id: "6", orderNumber: 1008, total: 14990, createdAt: new Date("2025-10-21"), paymentMethod: "PIX" },
];

const MONTHLY = [
  { month: "Jan", revenue: 2450000, orders: 42 },
  { month: "Fev", revenue: 3120000, orders: 58 },
  { month: "Mar", revenue: 3890000, orders: 71 },
  { month: "Abr", revenue: 3540000, orders: 65 },
  { month: "Mai", revenue: 4670000, orders: 89 },
  { month: "Jun", revenue: 5120000, orders: 95 },
  { month: "Jul", revenue: 4230000, orders: 78 },
  { month: "Ago", revenue: 5890000, orders: 110 },
  { month: "Set", revenue: 6780000, orders: 125 },
  { month: "Out", revenue: 7450000, orders: 148 },
];

const maxRevenue = Math.max(...MONTHLY.map((m) => m.revenue));

export default function AdminFinancial({ data }: Props) {
  const orders = data.orders.length > 0 ? data.orders : MOCK_ORDERS;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

  const paymentMethodBreakdown = orders.reduce<Record<string, number>>((acc, o) => {
    const m = o.paymentMethod ?? "Outro";
    acc[m] = (acc[m] ?? 0) + o.total;
    return acc;
  }, {});

  const methodIcons: Record<string, React.ReactNode> = {
    PIX: <QrCode className="w-4 h-4" />,
    CREDIT: <CreditCard className="w-4 h-4" />,
    BOLETO: <Barcode className="w-4 h-4" />,
  };

  const methodLabels: Record<string, string> = {
    PIX: "Pix",
    CREDIT: "Cartão de crédito",
    BOLETO: "Boleto",
  };

  const kpiColors = [
    { bg: "bg-[#f5f5f5]", text: "text-[#1a1a1a]" },
    { bg: "bg-[#edf4ff]", text: "text-[#2563eb]" },
    { bg: "bg-[#f9f9f9]", text: "text-[#555555]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#111]">Financeiro</h1>
        <p className="text-[#999] text-sm">Visão financeira da loja</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Receita total", value: formatPrice(totalRevenue), icon: DollarSign },
          { label: "Ticket médio", value: formatPrice(avgOrder), icon: TrendingUp },
          { label: "Transações", value: orders.length.toString(), icon: ShoppingBag },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#f0f0f0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpiColors[i].bg}`}>
                <Icon className={`w-4 h-4 ${kpiColors[i].text}`} />
              </div>
            </div>
            <p className="text-2xl font-black text-[#111]">{value}</p>
            <p className="text-xs text-[#999] mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <h3 className="font-bold text-[#111] mb-6">Receita mensal</h3>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY.map(({ month, revenue }, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-xs text-[#bbb] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatPrice(revenue)}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#1a1a1a]/20 to-[#1a1a1a]/60 group-hover:from-[#1a1a1a]/40 group-hover:to-[#1a1a1a] transition-colors min-h-[4px]"
                />
                <span className="text-[10px] text-[#bbb]">{month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <h3 className="font-bold text-[#111] mb-4">Formas de pagamento</h3>
          <div className="space-y-3">
            {Object.entries(paymentMethodBreakdown).map(([method, amount]) => {
              const pct = Math.round((amount / totalRevenue) * 100);
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-[#888]">
                      <span className="text-[#1a1a1a]">{methodIcons[method]}</span>
                      {methodLabels[method] ?? method}
                    </div>
                    <span className="text-sm font-semibold text-[#111]">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-[#1a1a1a] rounded-full"
                    />
                  </div>
                  <p className="text-xs text-[#bbb] mt-1">{formatPrice(amount)}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white border border-[#f0f0f0] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="p-5 border-b border-[#f0f0f0]">
          <h3 className="font-bold text-[#111]">Transações recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#bbb] border-b border-[#f8f7fb] bg-[#faf9fd]">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Método</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o.id} className="border-b border-[#f8f7fb] hover:bg-[#faf9fd] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#1a1a1a]">#{o.orderNumber}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#111]">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-[#888]">
                      <span className="text-[#1a1a1a]">{methodIcons[o.paymentMethod ?? ""] ?? <CreditCard className="w-4 h-4" />}</span>
                      {methodLabels[o.paymentMethod ?? ""] ?? o.paymentMethod ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#bbb]">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                      Aprovado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
