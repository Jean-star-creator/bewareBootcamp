"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Importe useSearchParams

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
// Removemos os imports do Dialog, DialogContent, etc.
// Se você REALMENTE quiser um dialog, pode manter, mas para uma página de sucesso completa, é incomum.

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Exemplo: pegando o ID do pedido da URL

  return (
    <>
      <Header /> {/* Mantém o cabeçalho */}

      <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center p-4 text-center">
        {/* Usamos um div simples em vez de DialogContent */}
        <Image
          src="/illustration.svg"
          alt="Success"
          width={300}
          height={300}
          className="mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold">Pedido efetuado!</h1> {/* Use h1 para o título da página */}
        {orderId && ( // Exibe o ID do pedido se estiver disponível
          <p className="mt-2 text-lg font-medium">
            Seu pedido <span className="font-bold">#{orderId}</span> foi efetuado com sucesso.
          </p>
        )}
        <p className="mt-2 font-medium">
          Você pode acompanhar o status na seção de “Meus Pedidos”.
        </p>

        <div className="mt-8 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button className="rounded-full" size="lg" asChild>
            <Link href="/my-orders">Ver meus pedidos</Link>
          </Button>
          <Button
            className="rounded-full"
            variant="outline"
            size="lg"
            asChild
          >
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CheckoutSuccessPage;