"use server";

import { error } from "console";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
  productVariantTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

interface finishOrderNowProps{
  productVariantId: string;
  quantity: number;
}

export const finishOrderNow = async ({productVariantId , quantity}: finishOrderNowProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      // items: {
      //   with: {
      //     productVariant: true,
      //   },
      // },
    },
  });
  
  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.shippingAddress) {
       // throw new Error("Shipping address not found");
  }


   console.log(cart);
  // if (!cart.shippingAddress) {
  //   throw new Error("Shipping address not found");
  // }
  // const totalPriceInCents = cart.items.reduce(
  //   (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
  //   0,
  // );
    const productVariant = await db.query.productVariantTable.findFirst({
      where: eq(productVariantTable.id, productVariantId)
    }) ;
    
    if(!productVariant) {
      throw new Error("Prodcut variant not found");
    }

    const totalPriceInCents = productVariant.priceInCents * quantity;

    let orderId: string | undefined;
    await db.transaction(async (tx) => {
    
      if (!cart.shippingAddress) {
        throw new Error("Shipping address not found");
      }
      const [order] = await tx
        .insert(orderTable)
        .values({
          email: cart.shippingAddress.email,
          zipCode: cart.shippingAddress.zipCode,
          country: cart.shippingAddress.country,
          phone: cart.shippingAddress.phone,
          cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
          city: cart.shippingAddress.city,
          complement: cart.shippingAddress.complement,
          neighborhood: cart.shippingAddress.neighborhood,
          number: cart.shippingAddress.number,
          recipientName: cart.shippingAddress.recipientName,
          state: cart.shippingAddress.state,
          street: cart.shippingAddress.street,
          userId: session.user.id,
          totalPriceInCents,
          shippingAddressId: cart.shippingAddress!.id,
        })
        .returning();
      if (!order) {
        throw new Error("Failed to create order for buy now Button");
      }
      orderId = order.id;
      const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
        // cart.items.map((item) => ({
        //   orderId: order.id,
        //   productVariantId: item.productVariant.id,
        //   quantity: item.quantity,
        //   priceInCents: item.productVariant.priceInCents,
        // }));

         [{
          orderId: order.id,
          productVariantId: productVariant.id,
          quantity: quantity,
          priceInCents: productVariant.priceInCents,
        }];

        console.log("finish orden now");

      await tx.insert(orderItemTable).values(orderItemsPayload);
      // await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
      // await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
    });
  if (!orderId) {
    throw new Error("Failed to create order for buy now Button");
  }
  return { orderId };
};