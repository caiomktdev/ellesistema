import Link from "next/link";
import { Play, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#faf9fd] border-t border-[#eeeeee] mt-12 md:mt-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1">
          <span
            className="text-[2rem] leading-none tracking-[0.18em] text-[#111]"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontStyle: "italic" }}
          >
            elle
          </span>
          <p className="text-sm text-[#999] mt-3 leading-relaxed max-w-xs">
            Moda fitness premium com tecido zero transparência e caimento pensado para treino e lifestyle.
          </p>
          <div className="flex gap-2.5 mt-5">
            {[Share2, Play, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="min-h-11 min-w-11 border border-[#e8e8e8] rounded-lg flex items-center justify-center text-[#bbb] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          {
            title: "Ajuda",
            links: [
              ["Minha Conta", "/conta"],
              ["Meus Pedidos", "/conta/pedidos"],
              ["Rastrear Pedido", "/rastreio"],
              ["Trocas e Devoluções", "/trocas"],
              ["Fale Conosco", "/contato"],
            ],
          },
          {
            title: "Empresa",
            links: [
              ["Sobre Nós", "/sobre"],
              ["Afiliados", "/afiliados"],
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-xs font-semibold text-[#1a1a1a] tracking-widest uppercase mb-4">
              {title}
            </h3>
            <ul className="space-y-2.5">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#eeeeee] py-5 px-5 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#bbb]">
          © {new Date().getFullYear()} elle. Todos os direitos reservados.
        </p>
        <div className="flex gap-5">
          {[["Privacidade", "/privacidade"], ["Termos de Uso", "/termos"]].map(([label, href]) => (
            <Link key={href} href={href} className="text-xs text-[#bbb] hover:text-[#1a1a1a] transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
