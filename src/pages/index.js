
import React from "react";

//assets
import mac from "../assets/mac.png"
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {

  return (
    <main className="flex w-full h-fit flex-col overflow-hidden">
      <Header />
      <div className="flex md:flex-row sm:flex-col-reverse w-full sm:h-[65vh] md:h-[80vh]">
        <div className="flex w-full items-center justify-center  sm:p-0 md:pl-8">
          <div className="flex flex-col gap-2 animate-slide-in-r md:text-start sm:text-center">
            <span className="font-bold sm:text-3xl md:text-6xl">
              Encontre os <span className="text-typography-primary dark:text-dark-typography-primary">melhores</span><br />
              prestadores de serviços<br /> para a <span className="text-typography-primary dark:text-dark-typography-primary">sua obra!</span>
            </span>
            <p className="text-typography-light dark:text-dark-typography-light sm:text-sm md:text-xl">
              Trabalhamos com prestadores de serviços qualificados e comprometidos. <br className="md:block sm:hidden" />
              Descubra como podemos ajudá-lo a tornar seus projetos de construção realidade
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center sm:flex md:relative md:h-auto sm:h-full">
          <div className="absolute z-[9] sm:self-center md:left-auto sm:w-[250px] md:w-[500px] sm:h-[250px] md:h-[500px] bg-background-secondary rounded-full animate-slide-in-b" />
          <Image src={mac} alt="mac" className="z-[10] animate-slide-in-l sm:max-h-[400px] md:max-h-[500px]" />
        </div>
      </div>
      <div className="text-center flex flex-col h-fit gap-2 py-[50px] pb-[100px] animate-slide-in-t">
        <span className="font-bold sm:text-3xl md:text-6xl">
          Mais de <Link href="/categorias" className="text-typography-primary dark:text-dark-typography-primary hover:underline">
            1325
          </Link> empresas registradas
        </span>
        <p className="text-typography-light dark:text-dark-typography-light sm:text-sm md:text-xl">
          Clique no link acima ou <Link href="/categorias" className="text-typography-primary dark:text-dark-typography-primary underline">clique aqui</Link> para ver todas as categorias disponíveis
        </p>
      </div>
    </main>
  );
}