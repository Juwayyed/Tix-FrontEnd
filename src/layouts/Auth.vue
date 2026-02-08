<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import feather from "feather-icons";

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: null,
  },
});

const route = useRoute();

const displayTitle = computed(() => {
  return props.title || route.meta.title || "Welcome back";
});

onMounted(() => {
  feather.replace();
});
</script>

<template>
  <div
    class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <img
            src="/logo.png"
            alt="Tix Logo"
            class="w-12 h-12 object-contain"
          />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Tix</h2>
        <p class="mt-2 text-sm text-gray-600">{{ displayTitle }}</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
