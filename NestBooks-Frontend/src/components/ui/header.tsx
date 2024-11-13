import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Link, useNavigate } from "react-router-dom";

import { User, LogOut } from "lucide-react";

import { toast } from "sonner";

// @ts-ignore
import useAuthStore from "../../store/authStore";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="container flex pt-4 justify-end gap-4">
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
            <DropdownMenuItem onClick={() => navigate("/profile")}>
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
  );
};
