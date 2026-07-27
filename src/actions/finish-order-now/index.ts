"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  cartTable,
  orderItemTable,
  orderTable,
  productVariantTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

interface finishOrderNowProps {
  productVariantId: string;
  quantity: number;
}

export const finishOrderNow = async ({ productVariantId, quantity }: finishOrderNowProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, 
session.user.id
),
    with: { shippingAddress: true },
  });

  if (!cart) throw new Error("Cart not found");

  // SE NÃO TIVER ENDEREÇO, RETORNA STATUS PARA O FRONTEND
  if (!cart.shippingAddress) {
    return { error: "MISSING_ADDRESS" };
  }

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(
productVariantTable.id
, productVariantId),
  });

  if (!productVariant) throw new Error("Product variant not found");

  const totalPriceInCents = productVariant.priceInCents * quantity;
  let orderId: string | undefined;

  await db.transaction(async (tx) => {
    const address = cart.shippingAddress!; // Aqui temos certeza que existe

    const [order] = await tx
      .insert(orderTable)
      .values({
        email: 
address.email
,
        zipCode: address.zipCode,
        country: 
address.country
,
        phone: 
address.phone
,
        cpfOrCnpj: address.cpfOrCnpj,
        city: 
address.city
,
        complement: address.complement,
        neighborhood: address.neighborhood,
        number: address.number,
        recipientName: address.recipientName,
        state: address.state,
        street: address.street,
        userId: 
session.user.id
,
        totalPriceInCents,
        shippingAddressId: 
address.id
,
      })
      .returning();

    if (!order) throw new Error("Failed to create order");

    orderId = 
order.id
;

    await tx.insert(orderItemTable).values([{
      orderId: 
order.id
,
      productVariantId: 
productVariant.id
,
      quantity: quantity,
      priceInCents: productVariant.priceInCents,
    }]);
  });

  return { orderId };
}; 