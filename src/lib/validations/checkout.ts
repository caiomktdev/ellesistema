import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  name: z.string().min(3, "Nome inválido"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  zipCode: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua inválida"),
  number: z.string().min(1, "Número inválido"),
  complement: z.string().optional(),
  district: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido"),
  paymentMethod: z.enum(["pix", "credit", "boleto"]),
  couponCode: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, "Carrinho vazio"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
