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
    <div className="min-h-screen bg-[#f5fffe] w-full">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="max-w-2xl lg:pr-8 w-full lg:w-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6">Book Nest</h1>
          <p className="text-xl sm:text-2xl mb-8 sm:mb-12 leading-relaxed">
            Descubre tu próximo libro favorito, conecta con otros lectores y
            explora mundos más allá de las páginas
          </p>
          <Link to="/explore">
            <Button className="bg-[#98b5a5] hover:bg-[#89a696] text-black px-8 sm:px-16 py-4 sm:py-6 rounded-full text-lg sm:text-xl w-full sm:w-auto">
              EXPLORAR
            </Button>
          </Link>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px]">
            <div className="absolute inset-0 bg-[#daf0e9] rounded-full -z-10 transform translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4" />
            <img
              src="../landing-page-img.png"
              alt="Stack of books with a cactus"
              className="relative z-10 w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}