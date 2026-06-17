"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatPrice, formatDatetime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: number;
  total: number;
  status: string;
  createdAt: Date;
  user?: { name: string; email: string } | null;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
}

const CHART_DATA = [
  { month: "Jan", value: 42 },
  { month: "Fev", value: 58 },
  { month: "Mar", value: 71 },
  { month: "Abr", value: 65 },
  { month: "Mai", value: 89 },
  { month: "Jun", value: 95 },
  { month: "Jul", value: 78 },
  { month: "Ago", value: 110 },
  { month: "Set", value: 125 },
  { month: "Out", value: 148 },
];

const max = Math.max(...CHART_DATA.map((d) => d.value));

const MOCK_ORDERS: Order[] = [
  { id: "1", orderNumber: 1001, total: 18990, status: "DELIVERED", createdAt: new Date("2025-10-15"), user: { name: "Lucas Fernandes", email: "lucas@email.com" } },
  { id: "2", orderNumber: 1002, total: 35480, status: "SHIPPED", createdAt: new Date("2025-10-16"), user: { name: "Mariana Costa", email: "mariana@email.com" } },
  { id: "3", orderNumber: 1003, total: 8990, status: "PROCESSING", createdAt: new Date("2025-10-17"), user: { name: "Rafael Souza", email: "rafael@email.com" } },
  { id: "4", orderNumber: 1004, total: 12990, status: "PENDING", createdAt: new Date("2025-10-18"), user: { name: "Camila Rodrigues", email: "camila@email.com" } },
  { id: "5", orderNumber: 1005, total: 6990, status: "PAID", createdAt: new Date("2025-10-19"), user: { name: "Pedro Lima", email: "pedro@email.com" } },
];

export default function AdminDashboard({ stats }: { stats: Stats }) {
  const orders = stats.recentOrders.length > 0 ? stats.recentOrders : MOCK_ORDERS;

  const cards = [
    { label: "Receita total", value: formatPrice(stats.totalRevenue), icon: DollarSign, change: "+18%", up: true, bg: "bg-[#f5f5f5]", color: "text-[#1a1a1a]" },
    { label: "Pedidos", value: stats.totalOrders.toString(), icon: ShoppingBag, change: "+12%", up: true, bg: "bg-[#edf4ff]", color: "text-[#2563eb]" },
    { label: "Produtos ativos", value: stats.totalProducts.toString(), icon: Package, change: "+5", up: true, bg: "bg-[#f9f9f9]", color: "text-[#555555]" },
    { label: "Pendentes", value: stats.pendingOrders.toString(), icon: Clock, change: "-3", up: false, bg: "bg-[#fffbeb]", color: "text-[#d97706]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#111] mb-1">Dashboard</h1>
        <p className="text-[#999] text-sm">Visão geral da loja Line Fit</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, change, up, bg, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-[#f0f0f0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-500" : "text-red-400"}`}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-black text-[#111] mb-1">{value}</p>
            <p className="text-xs text-[#999]">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#111]">Pedidos por mês</h3>
              <p className="text-xs text-[#bbb] mt-0.5">Últimos 10 meses</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a] font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+32% este ano</span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-40">
            {CHART_DATA.map(({ month, value }, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / max) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#1a1a1a]/20 to-[#1a1a1a]/60 hover:from-[#1a1a1a]/40 hover:to-[#1a1a1a] transition-colors cursor-default relative group"
                  title={`${value} pedidos`}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#999] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value}
                  </span>
                </motion.div>
                <span className="text-[10px] text-[#bbb]">{month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        >
          <h3 className="font-bold text-[#111] mb-4">Ações rápidas</h3>
          <div className="space-y-2">
            {[
              { href: "/admin/produtos/novo", label: "Adicionar produto", icon: Package },
              { href: "/admin/pedidos?status=PENDING", label: "Ver pedidos pendentes", icon: Clock },
              { href: "/admin/cupons/novo", label: "Criar cupom", icon: ShoppingBag },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#faf9fd] hover:bg-[#f5f5f5] border border-[#f0f0f0] hover:border-[#aaaaaa] transition-all group"
              >
                <div className="p-1.5 bg-[#f5f5f5] group-hover:bg-white rounded-lg transition-colors">
                  <Icon className="w-3.5 h-3.5 text-[#1a1a1a]" />
                </div>
                <span className="text-sm text-[#888] group-hover:text-[#1a1a1a] transition-colors">
                  {label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#ddd] group-hover:text-[#1a1a1a] ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#f0f0f0] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#f0f0f0]">
          <h3 className="font-bold text-[#111]">Pedidos recentes</h3>
          <Link href="/admin/pedidos" className="text-xs text-[#1a1a1a] font-semibold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#bbb] border-b border-[#f8f7fb] bg-[#faf9fd]">
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#f8f7fb] hover:bg-[#faf9fd] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/pedidos/${order.id}`} className="text-sm font-semibold text-[#1a1a1a] hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[#111]">{order.user?.name ?? "—"}</p>
                    <p className="text-xs text-[#bbb]">{order.user?.email ?? ""}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#111]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] ?? "text-[#888] bg-[#f0f0f0]"}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#bbb]">
                    {formatDatetime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
