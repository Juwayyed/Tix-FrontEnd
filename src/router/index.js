import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Admin from "@/layouts/Admin.vue";
import Auth from "@/layouts/Auth.vue";
import App from "@/layouts/App.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import TicketList from "@/views/admin/ticket/TicketList.vue";
import TicketDetail from "@/views/admin/ticket/TicketDetail.vue";
import AppDashboard from "@/views/app/Dashboard.vue";
import AppTicketDetail from "@/views/app/TicketDetail.vue";
import AppTicketCreate from "@/views/app/TicketCreate.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: App,
      children: [
        {
          path: "",
          name: "app.dashboard",
          component: AppDashboard,
          meta: {
            requiresAuth: true,
            title: "Dashboard",
          },
        },
        {
          path: "ticket/:code",
          name: "app.ticket.detail",
          component: AppTicketDetail,
          meta: {
            requiresAuth: true,
            title: "Ticket Detail",
          },
        },
        {
          path: "ticket/create",
          name: "app.ticket.create",
          component: AppTicketCreate,
          meta: {
            requiresAuth: true,
            title: "Create New Ticket",
          },
        },
      ],
    },
    {
      path: "/admin",
      component: Admin,
      children: [
        {
          path: "dashboard",
          name: "admin.dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true,
            title: "Admin Dashboard",
          },
        },
        {
          path: "ticket",
          name: "admin.ticket",
          component: TicketList,
          meta: {
            requiresAuth: true,
            title: "Tickets Management",
          },
        },
        {
          path: "ticket/:code",
          name: "admin.ticket.detail",
          component: TicketDetail,
          meta: {
            requiresAuth: true,
            title: "Ticket Details",
          },
        },
      ],
    },
    {
      path: "/auth",
      component: Auth,
      children: [
        {
          path: "login",
          name: "login",
          component: Login,
          meta: {
            requiresUnauth: true,
            title: "Login",
          },
        },
        {
          path: "register",
          name: "register",
          component: Register,
          meta: {
            requiresUnauth: true,
            title: "Register",
          },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.title) {
    document.title = `Tix - ${to.meta.title}`;
  }

  const token = authStore.token;
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: "login" });
    }

    if (!authStore.user) {
      try {
        await authStore.checkAuth();
        if (!authStore.user) {
          return next({ name: "login" });
        }
      } catch (error) {
        return next({ name: "login" });
      }
    }
    return next();
  }

  if (to.meta.requiresUnauth && isAuthenticated) {
    if (!authStore.user) {
      try {
        await authStore.checkAuth();
      } catch (e) {
        return next();
      }
    }
    const target =
      authStore.user?.role === "admin" ? "admin.dashboard" : "app.dashboard";
    return next({ name: target });
  }

  next();
});

export default router;
