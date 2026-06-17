"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Dumbbell, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fd] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f5f5f5,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-[#111]">
              LINE<span className="text-[#1a1a1a]">FIT</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111]">Entrar na conta</h1>
          <p className="text-[#999] text-sm mt-1">Bem-vindo de volta!</p>
        </div>

        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(98,41,157,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs text-[#999] mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-3 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#999] mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-3 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb] pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#1a1a1a] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/esqueci-senha" className="text-xs text-[#bbb] hover:text-[#1a1a1a] transition-colors">
                Esqueci minha senha
              </Link>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_4px_16px_rgba(98,41,157,0.3)]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-[#999] mt-5">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-[#1a1a1a] font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
