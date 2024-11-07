// LoginForm.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @ts-ignore
import useAuthStore from "../store/authStore";
import { toast } from "sonner";

const LoginForm = () => {
  const { login, error, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.success("Login exitoso!");
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      setEmail("");
      setPassword("");
    } catch (e) {
      console.error("Login failed:", error);
      setErr("Login failed, please try again.");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
            {error && <p className="text-red-500">Error en el login</p>}
            <Button type="submit" className="w-full mt-2">
              Log In
            </Button>
            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground mt-2">
                Sin usuario?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Registrarse
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginForm;
