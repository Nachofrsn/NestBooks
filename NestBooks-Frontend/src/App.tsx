import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import BookPage from "./pages/BookPage";
import Profile from "./pages/Profile";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";

import { Toaster } from "sonner";

import { useEffect } from "react";
//@ts-ignore
import useAuthStore from "./store/authStore";

export const App = () => {
  const { initializeUser } = useAuthStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <>
      <Toaster position="bottom-right" duration={3000}/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/bookdetails" element={<BookPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};
