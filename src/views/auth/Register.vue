<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const handleSubmit = async () => {
  await authStore.register({ ...form.value });
};

const isPasswordVisible = ref(false);
const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Full Name</label
      >
      <div class="mt-1 relative">
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="John Doe"
          :class="{ 'border-red-500 ring-red-500': error }"
        />
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <i data-feather="user" class="w-4 h-4 text-gray-400"></i>
        </div>
      </div>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email</label
      >
      <div class="mt-1 relative">
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="name@company.com"
        />
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <i data-feather="mail" class="w-4 h-4 text-gray-400"></i>
        </div>
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
      >
      <div class="mt-1 relative">
        <input
          v-model="form.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          id="password"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="•••••••••••••"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            @click="togglePassword"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <i
              :data-feather="isPasswordVisible ? 'eye-off' : 'eye'"
              class="w-4 h-4"
            ></i>
          </button>
        </div>
      </div>
    </div>

    <div>
      <label
        for="password_confirmation"
        class="block text-sm font-medium text-gray-700"
        >Confirm Password</label
      >
      <div class="mt-1 relative">
        <input
          v-model="form.password_confirmation"
          :type="isPasswordVisible ? 'text' : 'password'"
          id="password_confirmation"
          class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="•••••••••••••"
        />
      </div>
    </div>

    <div v-if="error" class="text-xs text-red-500 bg-red-50 p-2 rounded">
      {{ error }}
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <span>{{ loading ? "Loading..." : "Sign Up" }}</span>
      </button>
    </div>
  </form>

  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or</span>
      </div>
    </div>
  </div>

  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600">
      Already have an account?
      <RouterLink
        :to="{ name: 'login' }"
        class="font-medium text-blue-600 hover:text-blue-800"
        >Log In Now</RouterLink
      >
    </p>
  </div>
</template>
