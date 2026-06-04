// src/app/product-variant/[slug]/_components/product-actions.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // Importar toast para feedback do usuário

import { addProductToCart } from "@/actions/add-cart-product";
import FinishOrderButton from "@/app/cart/confirmation/components/finish-order-button";
import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";
import FinishOrderButtonNow from "./finish-order-button-now";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  // // Mutação para adicionar ao carrinho (usada pelo AddToCartButton e pelo Comprar Agora)
  // const { mutateAsync: addItemToCart, isPending: isAddingToCart } = useMutation({
  //   mutationFn: () =>
  //     addProductToCart({
  //       productVariantId,
  //       quantity,
  //     }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["cart"] });
  //     toast.success("Produto adicionado à sacola!"); // Feedback para o usuário
  //   },
  //   onError: (error) => {
  //     console.error("Erro ao adicionar ao carrinho:", error);
  //     toast.error("Houve um erro ao adicionar o produto à sacola. Por favor, tente novamente.");
  //   },
  // });

  // // Mutação específica para "Comprar agora" que adiciona ao carrinho e depois redireciona
  // const { mutateAsync: buyNowMutate, isPending: isBuyingNow } = useMutation({
  //   mutationFn: async () => {
  //     // Reutiliza a função addProductToCart
  //     await addProductToCart({
  //       productVariantId,
  //       quantity,
  //     });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["cart"] }); // Invalida o cache do carrinho
  //     toast.success("Produto adicionado ao carrinho! Redirecionando para o checkout.");
  //     router.push(`/checkout?variantId=${productVariantId}&quantity=${quantity}`);
  //   },
  //   onError: (error) => {
  //     console.error("Erro ao comprar agora:", error);
  //     toast.error("Houve um erro ao processar sua compra. Por favor, tente novamente.");
  //   },
  // });

  // // Componente AddToCartButton (assumindo que ele está definido em outro lugar, por exemplo, no mesmo arquivo ou em um arquivo separado)
  // // Se ele for um componente separado, certifique-se de importá-lo.
  // // Para este exemplo, vou incluí-lo aqui para que o código seja completo.
  // const AddToCartButton = ({ productVariantId, quantity }: { productVariantId: string; quantity: number }) => {
  //   return (
  //     <Button
  //       className="rounded-full"
  //       size="lg"
  //       onClick={() => addItemToCart()}
  //       disabled={isAddingToCart}
  //     >
  //       {isAddingToCart && <Loader2 className="animate-spin mr-2" />}
  //       Adicionar à sacola
  //     </Button>
  //   );
  // };

  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-lg border">
            <Button size="icon" variant="ghost" onClick={handleDecrement} >
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement} >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 px-5">
        {/* Este é o seu componente AddToCartButton original */}
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        {/* <Button
          className="rounded-full bg-purple-600 hover:bg-purple-700 text-white" // Adicionei estilos para diferenciar, se desejar
          size="lg"
          onClick={() => buyNowMutate()} // Chama a mutação de "Comprar agora"
          disabled={isBuyingNow}
        >
          {isBuyingNow && <Loader2 className="animate-spin mr-2" />}
          Comprar agora
        </Button> */}
        <FinishOrderButtonNow
          productVariantId={productVariantId}
          quantity={quantity}
        />
      </div>
    </>
  );
};

export default ProductActions;