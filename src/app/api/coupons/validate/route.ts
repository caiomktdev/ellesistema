import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body.code ?? "");
    const subtotal = Number(body.subtotal ?? 0);

    if (!code.trim()) {
      return NextResponse.json({ valid: false, message: "Informe um cupom" }, { status: 400 });
    }

    const result = await validateCoupon(code, subtotal);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, message: "Erro ao validar cupom" }, { status: 500 });
  }
}
