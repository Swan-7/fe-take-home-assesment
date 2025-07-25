<template>
  <div class="p-4 sm:p-6 md:p-8 max-w-full md:max-w-6xl mx-auto bg-[color:var(--background-color)] text-[color:var(--text-color)] transition-colors duration-500 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <img src="@/assets/images/logo.svg" alt="Logo" class="h-10" />
      <button
        @click="toggleDarkMode"
        class="text-sm border rounded px-3 py-1 text-[color:var(--text-color)] border-gray-400 hover:bg-[color:var(--menu-hover-background)] transition-colors duration-300"
      >
        Toggle Dark Mode
      </button>
    </div>

    <h1 class="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
      <i class="pi pi-battery-full text-green-500" /> Battery Health Dashboard
    </h1>

    <el-empty v-if="batteryStatus.length === 0" description="No battery data available" />

    <div
      v-for="academy in batteryStatus"
      :key="academy.academyId"
      class="mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-500 hover:bg-[color:var(--menu-hover-background)] dark:hover:bg-gray-800"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
        <h2 class="text-base sm:text-lg font-semibold">
          <i class="pi pi-building mr-1 text-blue-600" /> Academy ID: {{ academy.academyId }}
        </h2>
        <div class="text-sm">
          <i class="pi pi-times-circle text-red-500" /> Unhealthy: {{ academy.unhealthyCount }} |
          <i class="pi pi-question-circle text-yellow-500" /> Unknown: {{ academy.unknownCount }}
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center">
          <i class="pi pi-exclamation-triangle mr-2 text-red-500" /> Devices Needing Replacement
        </h3>
        <ul
          v-if="academy.unhealthyCount > 0"
          class="list-disc list-inside text-sm"
        >
          <li
            v-for="device in academy.devices.filter(d => d.needsReplacement)"
            :key="device.serialNumber"
            class="mb-1"
          >
            <span class="font-mono break-all">{{ device.serialNumber }}</span> — Avg Drain:
            <strong>{{ device.averageDrainPerDay }}%</strong>
          </li>
        </ul>
        <p v-else class="text-sm italic">All devices appear healthy</p>
      </div>

      <div class="mt-4">
        <h3 class="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center">
          <i class="pi pi-question mr-2 text-yellow-500" /> Devices with Unknown Battery Usage
        </h3>
        <ul
          v-if="academy.unknownCount > 0"
          class="list-disc list-inside text-sm"
        >
          <li
            v-for="device in academy.devices.filter(d => d.averageDrainPerDay === null)"
            :key="device.serialNumber"
            class="mb-1"
          >
            <span class="font-mono break-all">{{ device.serialNumber }}</span>
          </li>
        </ul>
        <p v-else class="text-sm italic">No unknown battery data for this academy.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { analyzeBatteryData } from '@/services/batteryService';
import type { SchoolBatteryStatus } from '@/services/batteryService';

const batteryStatus = ref<SchoolBatteryStatus[]>([]);

onMounted(() => {
  batteryStatus.value = analyzeBatteryData();
});

function toggleDarkMode() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}
</script>

<style scoped>
.pi {
  font-size: 1rem;
  vertical-align: middle;
  transition: color 0.3s ease;
}
</style>
