import { create } from "zustand";
import axios from "axios";
import { url } from "@/utils/constants";

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isRegistered: false,
  initializeUser: async () => {
    try {
      const { data } = await axios.get(`${url}/session`, {
        withCredentials: true,
      });
      set({ user: data.user, error: null });
    } catch (e) {
      set({ user: null, error: null });
    }
  },
  login: async ({ email, password }) => {
    try {
      await axios.post(
        `${url}/login`,
        { email, password },
        { withCredentials: true }
      );
      const { data } = await axios.get(`${url}/protected`, {
        withCredentials: true,
      });
      set({ user: data.user, error: null });
    } catch (e) {
      set({ error: true });
    }
  },
  register: async ({ name, email, password }) => {
    set({ error: null, isRegistered: false });
    try {
      await axios.post(`${url}/register`, { name, email, password });
      set({ error: null, isRegistered: true });
    } catch (e) {
      set({ error: "Error en el registro", isRegistered: false });
    }
  },
  logout: async () => {
    await axios.post(`${url}/logout`, {}, { withCredentials: true });
    set({ user: null, isRegistered: false });
  },
}));

export default useAuthStore;
