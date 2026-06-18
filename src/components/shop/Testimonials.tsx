"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rodrigo A.",
    role: "Empresário",
    rating: 5,
    text: "Comprei o kit 4 camisas brancas e a qualidade superou minhas expectativas. Tecido macio, caimento perfeito e não amassa fácil. Já pedi mais dois kits.",
    initials: "RA",
  },
  {
    name: "Marcos V.",
    role: "Gerente comercial",
    rating: 5,
    text: "Uso o kit preto no dia a dia do trabalho. Entrega rápida, embalagem caprichada e as camisas são exatamente como descritas. Recomendo muito.",
    initials: "MV",
  },
  {
    name: "Felipe T.",
    role: "Autônomo",
    rating: 5,
    text: "O kit ofwhite ficou sensacional. Cor bonita, tecido de qualidade e o preço pelo kit compensa demais. Virou minha marca favorita de camisas.",
    initials: "FT",
  },
  {
    name: "Lucas P.",
    role: "Professor",
    rating: 5,
    text: "Comprei o kit 2 para testar e adorei. A camisa não desbota após várias lavagens e o caimento continua ótimo. Com certeza vou pedir o kit com 4.",
    initials: "LP",
  },
];

const colors = ["bg-[#f5f5f5] text-[#1a1a1a]", "bg-[#edf4ff] text-[#2563eb]", "bg-[#f9f9f9] text-[#555555]", "bg-[#f0fdf4] text-[#16a34a]"];

export default function Testimonials() {
  return (
    <section className="bg-[#faf9fd] border-y border-[#f0f0f0] py-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs text-[#1a1a1a] font-semibold tracking-widest uppercase mb-2">
            Depoimentos
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#111]">O que nossos clientes dizem</h2>
          <p className="text-[#999] text-sm mt-2">+12.000 avaliações · Nota 4.9 de 5</p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-1 px-1 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.04)] min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-start"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-[#1a1a1a] text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-[#555] leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${colors[i]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111]">{t.name}</p>
                  <p className="text-xs text-[#bbb]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
