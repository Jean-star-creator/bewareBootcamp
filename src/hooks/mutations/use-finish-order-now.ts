import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrderNow } from "@/actions/finish-order-now";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseFinishOrderNowMutationKey = () => ["finish-order-now"];

interface UseFinishOrderNowProps {
  productVariantId: string,
  quantity: number
}

export const useFinishOrderNow = ({productVariantId,quantity}: UseFinishOrderNowProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseFinishOrderNowMutationKey(),
    mutationFn: async () => {
      return await finishOrderNow({productVariantId, quantity} );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
      console.log("Pedido Realizado com Sucesso,finishOrderNow")
    },
  });
};

// byNowButton (interface) => useFinishOrderNow (mutation) => finishOrdeNow (server action)  