import Admin from "@/layouts/Admin.vue";
import Auth from "@/layouts/Auth.vue";
import { useAuthStore } from "@/stores/auth";
import Dashboard from "@/views/admin/Dashboard.vue";
import TicketList from "@/views/admin/ticket/TicketList.vue";
import TicketDetail from "@/views/admin/ticket/TicketDetail.vue";
import Login from "@/views/auth/Login.vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "@/layouts/App.vue";
import AppDashboard from "@/views/app/Dashboard.vue";
import AppTicketDetail from "@/views/app/TicketDetail.vue";
import AppTicketCreate from "@/views/app/TicketCreate.vue";
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
            title: "Login to your account",
          },
        },
        {
          path: "register",
          name: "register",
          component: Register,
          meta: {
            requiresUnauth: true,
            title: "Create a new account",
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

  if (to.meta.requiresAuth) {
    if (token) {
      if (!authStore.user) {
        try {
          await authStore.checkAuth();
          if (authStore.user) {
            next();
          } else {
            next({ name: "login" });
          }
        } catch (error) {
          next({ name: "login" });
        }
      } else {
        next();
      }
    } else {
      next({ name: "login" });
    }
  } else if (to.meta.requiresUnauth && token) {
    if (!authStore.user) {
      try {
        await authStore.checkAuth();
      } catch (e) {}
    }
    const target =
      authStore.user?.role === "admin" ? "admin.dashboard" : "app.dashboard";
    next({ name: target });
  } else {
    next();
  }
});

export default router;
