<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { CITIES } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{ selectedCities: string[] }>();
const emit = defineEmits<{ close: []; confirm: [cities: string[]] }>();

const tempSelected = ref<string[]>([...props.selectedCities]);

function toggleCity(city: string) {
  const idx = tempSelected.value.indexOf(city);
  if (idx >= 0) tempSelected.value.splice(idx, 1);
  else tempSelected.value.push(city);
}
</script>

<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="emit('close')" />
    <div class="relative w-full max-w-4xl max-h-[80vh] bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)] flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-tech-blue">{{ CONTENT.radarPage.filters.moreRegions }}</h2>
        <button @click="emit('close')" class="text-white/40 hover:text-white transition-colors"><X :size="24" /></button>
      </div>
      <div class="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
        <div v-for="province in CITIES.provinces" :key="province.name" class="space-y-4">
          <h3 class="text-sm font-bold text-white/40 uppercase tracking-widest border-l-2 border-tech-blue pl-3">{{ province.name }}</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <button
              v-for="city in province.cities"
              :key="city"
              @click="toggleCity(city)"
              :class="[
                'px-3 py-2 rounded-xl text-xs border transition-all',
                tempSelected.includes(city)
                  ? 'bg-tech-blue text-black border-tech-blue font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-tech-blue/30'
              ]"
            >{{ city }}</button>
          </div>
        </div>
      </div>
      <div class="flex gap-4 pt-8 border-t border-white/10 mt-6">
        <button @click="emit('close')" class="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors">{{ CONTENT.common.cancel }}</button>
        <button @click="emit('confirm', tempSelected)" class="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform">{{ CONTENT.common.confirm }}</button>
      </div>
    </div>
  </div>
</template>
