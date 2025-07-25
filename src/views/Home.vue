<template>
  <div class="p-8 max-w-5xl mx-auto bg-[color:var(--background-color)] text-[color:var(--text-color)] transition-colors duration-500">
    <div class="flex items-center justify-between mb-6">
      <img src="@/assets/images/logo.svg" alt="Logo" class="h-10" />
      <button
        @click="toggleDarkMode"
        class="text-xs border rounded px-3 py-1 text-[color:var(--text-color)] border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
      >
        Toggle Theme
      </button>
    </div>

    <h1 class="text-3xl font-bold mb-6">
      <i class="pi pi-battery-full text-green-500 mr-2" /> Battery Health Dashboard
    </h1>

    <el-empty v-if="batteryStatus.length === 0" description="No battery data available" />

    <div
      v-for="academy in batteryStatus"
      :key="academy.academyId"
      class="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-900 transition-colors duration-500"
    >
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">
          <i class="pi pi-building mr-1 text-blue-600" /> Academy ID: {{ academy.academyId }}
        </h2>
        <div class="text-sm">
          <i class="pi pi-times-circle text-red-500" /> Unhealthy: {{ academy.unhealthyCount }} |
          <i class="pi pi-question-circle text-yellow-500" /> Unknown: {{ academy.unknownCount }}
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-sm font-semibold text-red-700 mb-2 flex items-center">
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
            <span class="font-mono">{{ device.serialNumber }}</span> — Avg Drain:
            <strong>{{ device.averageDrainPerDay }}%</strong>
          </li>
        </ul>
        <p v-else class="text-sm italic">All devices appear healthy 🎉</p>
      </div>

      <div class="mt-4">
        <h3 class="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
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
            <span class="font-mono">{{ device.serialNumber }}</span>
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
  document.documentElement.classList.toggle('dark');
}
</script>

<style scoped>
.pi {
  font-size: 1rem;
  vertical-align: middle;
  transition: color 0.3s ease;
}
</style>
