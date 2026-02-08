<script setup>
import { onMounted, watch, nextTick, ref } from "vue";
import { Chart } from "chart.js/auto";
import { useDashboardStore } from "@/stores/dashboard";
import { useTicketStore } from "@/stores/ticket";
import { storeToRefs } from "pinia";
import feather from "feather-icons";
import { capitalize } from "lodash";
import { DateTime } from "luxon";

const dashboardStore = useDashboardStore();
const { statistic } = storeToRefs(dashboardStore);
const { fetchStatistics } = dashboardStore;

const ticketStore = useTicketStore();
const { tickets } = storeToRefs(ticketStore);
const { fetchTickets } = ticketStore;

const isLoading = ref(true);
let chart = null;

const toggleTicketMenu = (ticket) => {
  ticket.showMenu = !ticket.showMenu;
};

const createChart = () => {
  const canvas = document.getElementById("statusChart");
  if (!canvas) return;

  const statusCtx = canvas.getContext("2d");
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(statusCtx, {
    type: "doughnut",
    data: {
      labels: ["Open", "In Progress", "Resolved", "Rejected"],
      datasets: [
        {
          data: [
            statistic.value?.status_distibution?.open || 0,
            statistic.value?.status_distibution?.in_progress || 0,
            statistic.value?.status_distibution?.resolved || 0,
            statistic.value?.status_distibution?.rejected || 0,
          ],
          backgroundColor: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
      cutout: "70%",
    },
  });
};

watch(
  [() => statistic.value, isLoading],
  async ([newStat, newLoading]) => {
    if (newStat && !newLoading) {
      await nextTick();
      createChart();
    }
  },
  { deep: true },
);

onMounted(async () => {
  try {
    await Promise.all([fetchTickets(), fetchStatistics()]);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
    await nextTick();
    feather.replace();
    createChart();
  }
});
</script>

<template>
  <div class="p-6">
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center h-64"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
      ></div>
      <p class="text-gray-500">Loading Dashboard Data...</p>
    </div>

    <div v-show="!isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Tickets</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">
                {{ statistic?.total_tickets || 0 }}
              </h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <i data-feather="tag" class="w-6 h-6 text-blue-600"></i>
            </div>
          </div>
        </div>

        <div
          class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Tickets</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">
                {{ statistic?.active_tickets || 0 }}
              </h3>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg">
              <i data-feather="clock" class="w-6 h-6 text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div
          class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Resolved</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">
                {{ statistic?.resolved_tickets || 0 }}
              </h3>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
            </div>
          </div>
        </div>

        <div
          class="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Avg. Resolution</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-1">
                {{ statistic?.avg_resolution_time || 0 }} Hrs
              </h3>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <i data-feather="clock" class="w-6 h-6 text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <div
          class="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div
            class="p-6 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold text-gray-800">Recent Tickets</h3>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="ticket in tickets"
              :key="ticket.code"
              class="p-4 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-800">
                    {{ ticket.title }}
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">#{{ ticket.code }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <span
                      class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                    >
                      {{ capitalize(ticket.status) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ DateTime.fromISO(ticket.created_at).toRelative() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-6 self-start">
            Status Distribution
          </h3>
          <div class="relative w-full aspect-square max-w-[280px]">
            <canvas id="statusChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
