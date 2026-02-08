<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { logout } = authStore;

const showUserMenu = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <RouterLink
            :to="{ name: 'app.dashboard' }"
            class="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="Tix Logo"
              class="w-8 h-8 object-contain"
            />
            <span class="ml-2 text-xl font-bold teَxt-blue-600">Tix</span>
          </RouterLink>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
          >
            <i data-feather="bell" class="w-6 h-6"></i>
            <span
              class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>

          <div class="relative">
            <button
              @click="toggleUserMenu()"
              class="flex items-center bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <img
                :src="`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`"
                alt="Profile"
                class="w-8 h-8 rounded-full"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">{{
                user?.name
              }}</span>
              <i
                data-feather="chevron-down"
                class="w-4 h-4 ml-2 text-gray-500"
              ></i>
            </button>

            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
            >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </a>
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Settings
              </a>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
