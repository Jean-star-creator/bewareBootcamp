import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartSummary from "@/app/cart/components/cart-summary"; 
import Addresses from "@/app/cart/identification/components/addresses";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { productVariantTable,shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface BuyNowProps {
  searchParams: Promise<{ variantId: string; quantity: string }>;
}

const BuyNowIdentificationPage = async ({ searchParams }: BuyNowProps) => {
  const { variantId, quantity } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect("/");

  // Busca variante específica
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, variantId),
    with: { product: true },
  });
  if (!productVariant) redirect("/");

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  const total = productVariant.priceInCents * Number(quantity);

  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={null}
          // Aqui dizemos para onde ir após escolher o endereço:
          onSuccessPath={`/buy-now/confirmation?variantId=${variantId}&quantity=${quantity}`}
        />
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
      <Footer />
    </div>
  );
};
export default BuyNowIdentificationPage;