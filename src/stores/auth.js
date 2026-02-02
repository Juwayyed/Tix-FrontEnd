import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    success: null,
  }),

  getters: {
    token: () => Cookies.get("token"),
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        await axiosInstance.get("http://127.0.0.1:8000/sanctum/csrf-cookie");
        const response = await axiosInstance.post("/login", credentials);
        const token = response.data.data.token;
        const user = response.data.data.user;

        Cookies.set("token", token);
        this.user = user;
        this.success = response.data.message;

        if (user.role === "admin") {
          router.push({ name: "admin.dashboard" });
        } else {
          router.push({ name: "app.dashboard" });
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Unauthorized";
      } finally {
        this.loading = false;
      }
    },

    async register(credentials) {
      this.loading = true;
      this.error = null;

      try {
        await axiosInstance.get("/../sanctum/csrf-cookie");

        const response = await axiosInstance.post("/register", credentials);
        const token = response.data.data.token;
        const user = response.data.data.user;

        Cookies.set("token", token);
        this.user = user;
        this.success = response.data.message;

        router.push({ name: "app.dashboard" });
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      try {
        await axiosInstance.post("/logout");
        Cookies.remove("token");
        this.user = null;
        this.error = null;
        router.push({ name: "login" });
      } catch (error) {
        this.error = "Logout failed";
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/user");
        this.user = response.data;
      } catch (error) {
        this.user = null;
        Cookies.remove("token");
      } finally {
        this.loading = false;
      }
    },
  },
});
