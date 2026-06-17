"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { calcOrderTotals } from "@/lib/order-totals";
import { CreditCard, Barcode, QrCode, MapPin, Check, ArrowRight, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  { id: "pix", label: "Pix", icon: QrCode, desc: "10% de desconto" },
  { id: "credit", label: "Cartão de Crédito", icon: CreditCard, desc: "Em até 12x sem juros" },
  { id: "boleto", label: "Boleto", icon: Barcode, desc: "Vence em 3 dias úteis" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, appliedCoupon } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "review">("address");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", cpf: "", phone: "",
    zipCode: "", street: "", number: "", complement: "",
    district: "", city: "", state: "",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
  });

  useEffect(() => setMounted(true), []);

  const subtotal = total();
  const { shipping, couponDiscount, pixDiscount, total: orderTotal } = calcOrderTotals(
    subtotal,
    appliedCoupon,
    paymentMethod
  );

  useEffect(() => {
    if (mounted && items.length === 0 && !completed) {
      router.replace("/carrinho");
    }
  }, [mounted, items.length, completed, router]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const lookupCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          street: data.logradouro || f.street,
          district: data.bairro || f.district,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
      }
    } catch {
      /* ignore */
    } finally {
      setCepLoading(false);
    }
  };

  const validateAddress = () => {
    const required = ["name", "email", "cpf", "phone", "zipCode", "street", "number", "district", "city", "state"];
    for (const field of required) {
      if (!form[field as keyof typeof form]?.trim()) {
        setError(`Preencha o campo ${field}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            slug: product.slug,
            variantId: product.variantId,
            variantName: product.variantName,
            quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao processar pedido");
        return;
      }

      setOrderNumber(data.orderNumber);
      setCompleted(true);
      clearCart();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (completed) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(98,41,157,0.4)]"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-3xl font-black text-[#111] mb-3">Pedido realizado!</h1>
          <p className="text-[#888] mb-2">
            Seu pedido <strong>#LF{orderNumber?.toString().padStart(6, "0")}</strong> foi confirmado.
          </p>
          <p className="text-sm text-[#bbb] mb-8">Você receberá um e-mail com os detalhes em {form.email}.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#000000] transition-colors shadow-[0_4px_16px_rgba(98,41,157,0.3)]">
            Voltar à loja
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) return null;

  const inputClass = "w-full bg-white border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-xl px-4 py-3 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]";
  const steps = ["address", "payment", "review"] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="w-4 h-4 text-[#1a1a1a]" />
        <h1 className="text-2xl font-black text-[#111]">Checkout seguro</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: "address", label: "Endereço", short: "End." },
          { id: "payment", label: "Pagamento", short: "Pag." },
          { id: "review", label: "Revisão", short: "Rev." },
        ].map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              step === s.id
                ? "bg-[#1a1a1a] text-white"
                : i < steps.indexOf(step)
                ? "bg-[#f5f5f5] text-[#1a1a1a]"
                : "bg-[#f8f7fb] text-[#bbb]"
            }`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border border-current flex-shrink-0">
                {i < steps.indexOf(step) ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.short}</span>
            </div>
            {i < 2 && <div className="h-px bg-[#f0f0f0] w-3 sm:w-6 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "address" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <h2 className="font-bold text-[#111] mb-5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1a1a1a]" />
                  Dados pessoais
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { field: "name", label: "Nome completo", placeholder: "João da Silva", full: true },
                    { field: "email", label: "E-mail", placeholder: "joao@email.com", type: "email" },
                    { field: "cpf", label: "CPF", placeholder: "000.000.000-00" },
                    { field: "phone", label: "Telefone", placeholder: "(11) 99999-9999" },
                  ].map(({ field, label, placeholder, full, type }) => (
                    <div key={field} className={full ? "md:col-span-2" : ""}>
                      <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                      <input type={type ?? "text"} value={form[field as keyof typeof form]} onChange={set(field)} placeholder={placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <h2 className="font-bold text-[#111] mb-5">Endereço de entrega</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#999] mb-1.5">CEP</label>
                    <div className="relative">
                      <input
                        value={form.zipCode}
                        onChange={set("zipCode")}
                        onBlur={(e) => lookupCep(e.target.value)}
                        placeholder="00000-000"
                        className={inputClass}
                      />
                      {cepLoading && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-[#1a1a1a]" />}
                    </div>
                  </div>
                  {[
                    { field: "street", label: "Rua/Avenida", placeholder: "Av. Paulista", full: true },
                    { field: "number", label: "Número", placeholder: "1234" },
                    { field: "complement", label: "Complemento", placeholder: "Apto 42" },
                    { field: "district", label: "Bairro", placeholder: "Centro" },
                    { field: "city", label: "Cidade", placeholder: "São Paulo" },
                    { field: "state", label: "Estado", placeholder: "SP" },
                  ].map(({ field, label, placeholder, full }) => (
                    <div key={field} className={full ? "md:col-span-2" : ""}>
                      <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                      <input value={form[field as keyof typeof form]} onChange={set(field)} placeholder={placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => validateAddress() && setStep("payment")}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-4 rounded-xl transition-colors group shadow-[0_4px_16px_rgba(98,41,157,0.3)]"
              >
                Continuar para pagamento
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <h2 className="font-bold text-[#111] mb-5">Forma de pagamento</h2>
                <div className="space-y-3">
                  {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        paymentMethod === id
                          ? "border-[#1a1a1a] bg-[#fafafa]"
                          : "border-[#e8e8e8] hover:border-[#aaaaaa]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${paymentMethod === id ? "bg-[#f5f5f5]" : "bg-[#faf9fd]"}`}>
                        <Icon className={`w-5 h-5 ${paymentMethod === id ? "text-[#1a1a1a]" : "text-[#bbb]"}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#111]">{label}</p>
                        <p className={`text-xs ${paymentMethod === id ? "text-[#1a1a1a]" : "text-[#bbb]"}`}>{desc}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === id ? "border-[#1a1a1a]" : "border-[#ddd]"}`}>
                        {paymentMethod === id && <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "credit" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 grid md:grid-cols-2 gap-4">
                    {[
                      { field: "cardNumber", label: "Número do cartão", placeholder: "0000 0000 0000 0000", full: true },
                      { field: "cardName", label: "Nome no cartão", placeholder: "JOÃO DA SILVA", full: true },
                      { field: "cardExpiry", label: "Validade", placeholder: "MM/AA" },
                      { field: "cardCvv", label: "CVV", placeholder: "123" },
                    ].map(({ field, label, placeholder, full }) => (
                      <div key={field} className={full ? "md:col-span-2" : ""}>
                        <label className="block text-xs text-[#999] mb-1.5">{label}</label>
                        <input value={form[field as keyof typeof form]} onChange={set(field)} placeholder={placeholder} className={inputClass} />
                      </div>
                    ))}
                  </motion.div>
                )}

                {paymentMethod === "pix" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 bg-[#fafafa] border border-[#aaaaaa] rounded-xl p-4 text-center">
                    <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center border border-[#f0f0f0]">
                      <QrCode className="w-20 h-20 text-[#1a1a1a]" />
                    </div>
                    <p className="text-sm font-semibold text-[#111] mb-1">QR Code será gerado após confirmação</p>
                    <p className="text-xs text-[#999]">Válido por 30 minutos · 10% de desconto</p>
                  </motion.div>
                )}

                {paymentMethod === "boleto" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-4 text-center">
                    <Barcode className="w-12 h-12 text-[#1a1a1a] mx-auto mb-2" />
                    <p className="text-sm text-[#888]">O boleto será enviado por e-mail após confirmação</p>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("address")} className="px-6 py-4 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:border-[#aaaaaa] transition-colors">
                  Voltar
                </button>
                <button onClick={() => setStep("review")} className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-4 rounded-xl transition-colors group shadow-[0_4px_16px_rgba(98,41,157,0.3)]">
                  Revisar pedido
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <h2 className="font-bold text-[#111] mb-5">Revisar pedido</h2>
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div key={`${product.id}-${product.variantId}`} className="flex justify-between text-sm">
                      <span className="text-[#888]">{product.name} × {quantity}</span>
                      <span className="font-semibold text-[#111]">{formatPrice(product.price * quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#f0f0f0] pt-3 space-y-2">
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1a1a1a]">Cupom ({appliedCoupon?.code})</span>
                        <span className="text-[#1a1a1a]">-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#999]">Frete</span>
                      <span className={shipping === 0 ? "text-[#1a1a1a] font-semibold" : "text-[#111]"}>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
                    </div>
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#1a1a1a]">Desconto Pix (10%)</span>
                        <span className="text-[#1a1a1a]">-{formatPrice(pixDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-1">
                      <span className="text-[#111]">Total</span>
                      <span className="text-[#1a1a1a]">{formatPrice(orderTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("payment")} className="px-6 py-4 border border-[#e8e8e8] rounded-xl text-sm text-[#888] hover:text-[#1a1a1a] hover:border-[#aaaaaa] transition-colors">
                  Voltar
                </button>
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-4 rounded-xl transition-colors shadow-[0_4px_16px_rgba(98,41,157,0.3)] disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {loading ? "Processando..." : "Confirmar pedido"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-5 h-fit lg:sticky lg:top-[calc(var(--header-height)+1rem)] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h3 className="font-bold text-[#111] mb-4">Resumo</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map(({ product, quantity }) => (
              <div key={`${product.id}-${product.variantId}`} className="flex justify-between">
                <span className="text-[#999] truncate mr-2">{product.name} ×{quantity}</span>
                <span className="flex-shrink-0 text-[#111]">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f0f0f0] pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#999]">Subtotal</span>
              <span className="text-[#111]">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]">Cupom</span>
                <span className="text-[#1a1a1a]">-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#999]">Frete</span>
              <span className={shipping === 0 ? "text-[#1a1a1a] font-semibold" : "text-[#111]"}>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
            </div>
            {pixDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]">Desconto Pix</span>
                <span className="text-[#1a1a1a]">-{formatPrice(pixDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1">
              <span className="text-[#111]">Total</span>
              <span className="text-[#1a1a1a]">{formatPrice(orderTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
