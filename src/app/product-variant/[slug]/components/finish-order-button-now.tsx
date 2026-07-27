"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Importado
import { toast } from "sonner"; // Opcional para feedback

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrderNow } from "@/hooks/mutations/use-finish-order-now";

interface FinishOrderButtonNowProps {
  productVariantId: string;
  quantity: number;
}

const FinishOrderButtonNow = ({
  productVariantId,
  quantity,
}: FinishOrderButtonNowProps) => {
  const router = useRouter(); // Inicializado
  const finishOrderMutation = useFinishOrderNow({ productVariantId, quantity });

  const handleFinishOrder = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key is not set");
      }

      // 1. Executa a mutation
      const result = await finishOrderMutation.mutateAsync();

      if (result && "error" in result && result.error === "MISSING_ADDRESS") {
        toast.info("Por favor, selecione um endereço.");
        // Redireciona para a nossa nova rota paralela com os dados do produto
        router.push(`/buy-now/identification?variantId=${productVariantId}&quantity=${quantity}`);
        return;
      }

      // 3. Se deu tudo certo e temos o orderId, prossegue pro Stripe
      if (result && "orderId" in result && result.orderId) {
        const checkoutSession = await createCheckoutSession({
          orderId: result.orderId,
        });

        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        );

        if (!stripe) throw new Error("Failed to load Stripe");

        await stripe.redirectToCheckout({
          sessionId: 
checkoutSession.id
,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao processar seu pedido.");
    }
  };

  return (
    <Button
      className="w-full rounded-full"
      size="lg"
      onClick={handleFinishOrder}
      disabled={finishOrderMutation.isPending}
    >
      {finishOrderMutation.isPending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Comprar Agora
    </Button>
  );
};

export default FinishOrderButtonNow; 