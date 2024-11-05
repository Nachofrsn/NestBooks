import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

import { useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "sonner";

// @ts-ignore
import useAuthStore from "../store/authStore";

export default function Component() {
  const { user, logout, initializeUser } = useAuthStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <div className="h-screen bg-[#f5fffe] w-full">
      <header className="container p-4 flex justify-end gap-4">
        {!user ? (
          <>
            <Link to="/register">
              <Button variant="outline" className="text-sm">
                REGISTRARSE
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-sm">
                INICIAR SESION
              </Button>
            </Link>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  toast.success("Logout exitoso!");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

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
