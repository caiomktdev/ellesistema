import { NextResponse } from "next/server";
import { createOrder } from "@/lib/checkout";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const result = await createOrder(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar pedido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
