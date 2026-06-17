"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  DollarSign,
  Tag,
  Settings,
  Menu,
  X,
  Dumbbell,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/frete", icon: Truck, label: "Frete" },
  { href: "/admin/financeiro", icon: DollarSign, label: "Financeiro" },
  { href: "/admin/cupons", icon: Tag, label: "Cupons" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9fd] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#f0f0f0] z-50 flex flex-col transition-transform duration-300 shadow-[2px_0_16px_rgba(98,41,157,0.06)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-black text-[#111]">LINE<span className="text-[#1a1a1a]">FIT</span></span>
                <span className="block text-[10px] text-[#bbb] -mt-0.5">Admin Panel</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-[#bbb] hover:text-[#1a1a1a] rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  active
                    ? "bg-[#f5f5f5] text-[#1a1a1a] font-medium"
                    : "text-[#888] hover:text-[#1a1a1a] hover:bg-[#faf9fd]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-[#1a1a1a]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#f0f0f0] space-y-0.5">
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:bg-[#faf9fd] transition-all">
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#888] hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#f0f0f0] px-5 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-[#999]">
              {navItems.find((n) => n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href))?.label ?? "Admin"}
            </h1>
          </div>
          <Link href="/" className="text-xs text-[#bbb] hover:text-[#1a1a1a] transition-colors">
            ← Ver loja
          </Link>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
