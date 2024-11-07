import { Button } from "@/components/ui/button";

import { Header } from "@/components/ui/header";

import { useEffect } from "react";
import { Link } from "react-router-dom";

// @ts-ignore
import useAuthStore from "../store/authStore";

export default function Component() {
  const { initializeUser } = useAuthStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <div className="h-screen bg-[#f5fffe] w-full">
      <Header />
      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-2xl lg:pr-8">
          <h1 className="text-6xl font-normal mb-6">Book Nest</h1>
          <p className="text-2xl mb-12 leading-relaxed">
            Descubre tu próximo libro favorito, conecta con otros lectores y
            explora mundos más allá de las páginas
          </p>
          <Link to="/explore">
            <Button className="bg-[#98b5a5] hover:bg-[#89a696] text-black px-16 py-6 rounded-full text-xl">
              EXPLORAR
            </Button>
          </Link>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="relative w-[400px] h-[400px]">
            <div className="absolute inset-0 bg-[#daf0e9] rounded-full -z-10 transform translate-x-4 translate-y-4" />
            <img
              src="../landing-page-img.png"
              alt="Stack of books with a cactus"
              className="relative z-10"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
