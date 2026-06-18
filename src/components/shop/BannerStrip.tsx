"use client";

import { CreditCard, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "EM ATÉ 12X",
    desc: "sem juros no cartão",
  },
  {
    icon: Truck,
    title: "FRETE GRÁTIS",
    desc: "Sul e Sudeste acima de R$ 500",
  },
  {
    icon: ShieldCheck,
    title: "ZERO TRANSPARÊNCIA",
    desc: "Tecido premium testado",
  },
];

export default function BannerStrip() {
  return (
    <section className="relative z-10 mx-4 sm:mx-6 lg:mx-8 my-5 md:my-0 md:-mt-5 rounded-xl sm:rounded-2xl bg-white border border-[#ebebeb]/80 shadow-[0_8px_30px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto px-3 sm:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#ebebeb]">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
            >
              <Icon className="w-6 h-6 text-[#111] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-bold text-[#111] tracking-wider">{title}</p>
                <p className="text-xs text-[#888] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
