"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-[#1a1a1a] to-[#000000] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden text-center"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#fff,transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative">
          <div className="inline-flex p-3 bg-white/15 rounded-xl mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-white">
            Receba as melhores ofertas
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Assine nossa newsletter e ganhe 10% de desconto na primeira compra. Promoções exclusivas toda semana.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl"
            >
              <Check className="w-5 h-5" />
              Cadastrado! Verifique seu e-mail.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="flex-1 min-w-0 bg-white/15 border border-white/25 hover:border-white/40 focus:border-white/60 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-[#1a1a1a] font-bold px-6 py-3 rounded-xl transition-colors group w-full sm:w-auto"
              >
                Assinar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          <p className="text-xs text-white/50 mt-4">
            Sem spam. Cancelamento a qualquer momento.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
