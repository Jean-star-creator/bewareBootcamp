// src/app/checkout/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Para redirecionar para a página de sucesso

import { Header } from "@/components/common/header"; // Supondo que você queira o header aqui
import { Button } from "@/components/ui/button"; // Supondo que você precise de um botão para finalizar

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variantId = searchParams.get('variantId');
  const quantity = searchParams.get('quantity');

  // Função para simular a finalização do pedido e redirecionar para o sucesso
  const handleFinalizePurchase = () => {
    // Aqui você faria a lógica real de processamento do pedido:
    // 1. Enviar os dados do pedido (variantId, quantity, endereço, pagamento, etc.) para sua API de backend.
    // 2. Aguardar a resposta da API (sucesso ou falha).
    // 3. Se for sucesso, redirecionar para a página de sucesso com o ID do pedido.

    // Por enquanto, vamos simular um sucesso e redirecionar para a sua página de sucesso
    // Suponha que o ID do pedido gerado seja 'ORDER12345'
    const newOrderId = 'ORDER' + Math.floor(Math.random() * 100000); // Gerando um ID aleatório para teste

    router.push(`/checkout/success?orderId=${newOrderId}`);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Finalizar Compra</h1>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Detalhes do Pedido</h2>
            {variantId ? (
              <p className="text-lg text-gray-600">
                <span className="font-medium">Produto Variante ID:</span> <span className="font-bold text-blue-600">{variantId}</span>
              </p>
            ) : (
              <p className="text-lg text-red-500">Nenhum ID de produto variante encontrado.</p>
            )}
            {quantity ? (
              <p className="text-lg text-gray-600">
                <span className="font-medium">Quantidade:</span> <span className="font-bold text-blue-600">{quantity}</span>
              </p>
            ) : (
              <p className="text-lg text-red-500">Quantidade não especificada.</p>
            )}
            {/* Aqui você poderia adicionar mais detalhes do produto, preço, etc. */}
          </div>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Endereço de Entrega</h2>
            {/* Aqui entrariam os campos de formulário para o endereço */}
            <p className="text-gray-500 italic">
              (Campos de formulário para endereço de entrega seriam implementados aqui)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Exemplo de input: */}
                {/* <input type="text" placeholder="Nome Completo" className="p-2 border rounded" /> */}
                {/* <input type="text" placeholder="CEP" className="p-2 border rounded" /> */}
                {/* ... outros campos ... */}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Método de Pagamento</h2>
            {/* Aqui entrariam as opções de pagamento (cartão, pix, boleto, etc.) */}
            <p className="text-gray-500 italic">
              (Opções de método de pagamento seriam implementadas aqui)
            </p>
            {/* Exemplo de opções de pagamento: */}
            {/* <label><input type="radio" name="payment" value="credit_card" /> Cartão de Crédito</label><br/> */}
            {/* <label><input type="radio" name="payment" value="pix" /> Pix</label> */}
          </div>

          <Button
            className="w-full rounded-full py-3 text-xl font-bold bg-green-600 hover:bg-green-700 transition-colors"
            size="lg"
            onClick={handleFinalizePurchase}
          >
            Confirmar Pedido e Pagar
          </Button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ao confirmar, você concorda com nossos Termos e Condições.
          </p>
        </div>
      </div>
    </>
  );
}