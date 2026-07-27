import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartSummary from "@/app/cart/components/cart-summary";
import { formatAddress } from "@/app/cart/helpers/address";
import FinishOrderButtonNow from "@/app/product-variant/[slug]/components/finish-order-button-now";
import { Header } from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { cartTable, productVariantTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface BuyNowProps {
  searchParams: Promise<{ variantId: string; quantity: string }>;
}

const BuyNowConfirmationPage = async ({ searchParams }: BuyNowProps) => {
  const { variantId, quantity } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: { shippingAddress: true },
  });

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, variantId),
    with: { product: true },
  });

  if (!productVariant || !cart?.shippingAddress) {
    redirect(`/buy-now/identification?variantId=${variantId}&quantity=${quantity}`);
  }

  const total = productVariant.priceInCents * Number(quantity);

  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader><CardTitle>Endereço de Entrega</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <Card>
                <CardContent className="py-4">
                    <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
                </CardContent>
            </Card>
            {/* Reutilizamos o seu botão original que já sabe chamar a action e o Stripe */}
            <FinishOrderButtonNow 
                productVariantId={variantId} 
                quantity={Number(quantity)} 
            />
          </CardContent>
        </Card>
        <CartSummary
          subtotalInCents={total}
          totalInCents={total}
          products={[{
            id: productVariant.id,
            name: productVariant.product.name,
            variantName: productVariant.name,
            quantity: Number(quantity),
            priceInCents: productVariant.priceInCents,
            imageUrl: productVariant.imageUrl,
          }]}
        />
      </div>
    </div>
  );
};
export default BuyNowConfirmationPage;