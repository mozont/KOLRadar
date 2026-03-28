<script setup lang="ts">
import { computed } from 'vue';
import {
  Search, Mic, Filter, Plus,
  BarChart3, Info, Layers, Sparkles
} from 'lucide-vue-next';
import { CITIES, CONTENT_TYPES } from '../types';
import { CONTENT } from '../content';
import SearchInput from './SearchInput.vue';
import FilterRow from './FilterRow.vue';

interface Filters {
  tags: string[];
  price: string;
  followers: string;
  region: string[];
  type: string[];
}

const props = defineProps<{
  searchQuery: string;
  isSearching: boolean;
  showFilters: boolean;
  filters: Filters;
  isAnalyzingSearch: boolean;
  isVoiceInputActive: boolean;
  isAnalyzingVoice: boolean;
  projectCount: number;
}>();

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:filters': [value: Filters];
  'update:isVoiceInputActive': [value: boolean];
  'update:isAnalyzingVoice': [value: boolean];
  'search': [];
  'startSearch': [];
  'openTagModal': [];
  'openCityModal': [];
  'openProjects': [];
  'resetSearch': [];
}>();

const searchPlaceholder = computed(() =>
  props.isVoiceInputActive
    ? CONTENT.common.voicePlaceholder
    : CONTENT.common.searchPlaceholder
);

function handleVoiceToggle() {
  if (props.isVoiceInputActive) {
    emit('update:isVoiceInputActive', false);
    emit('update:isAnalyzingVoice', true);
    setTimeout(() => {
      emit('update:searchQuery', CONTENT.radarPage.initialSearch);
      emit('update:isAnalyzingVoice', false);
    }, 1500);
  } else {
    emit('update:isVoiceInputActive', true);
  }
}

function updateSearchQuery(value: string) {
  emit('update:searchQuery', value);
}

function removeTag(tag: string) {
  const next = props.filters.tags.filter((t: string) => t !== tag);
  emit('update:filters', { ...props.filters, tags: next.length ? next : [tag] });
}

function toggleRegion(city: string) {
  const isSelected = props.filters.region.includes(city);
  const next = isSelected
    ? props.filters.region.filter((c: string) => c !== city)
    : [...props.filters.region, city];
  emit('update:filters', { ...props.filters, region: next.length ? next : [city] });
}

function toggleContentType(type: string) {
  const isSelected = props.filters.type.includes(type);
  const next = isSelected
    ? props.filters.type.filter((t: string) => t !== type)
    : [...props.filters.type, type];
  emit('update:filters', { ...props.filters, type: next.length ? next : [type] });
}

function updatePrice(value: string | string[]) {
  emit('update:filters', { ...props.filters, price: value as string });
}

function updateFollowers(value: string | string[]) {
  emit('update:filters', { ...props.filters, followers: value as string });
}
</script>

<template>
  <div class="radar-page-enter container mx-auto px-4 pt-20 pb-10 flex flex-col items-center relative">
    <!-- Projects button (top-right) -->
    <div class="absolute top-8 right-8 z-50">
      <button
        @click="emit('openProjects')"
        class="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue relative group"
      >
        <Layers :size="24" class="group-hover:scale-110 transition-transform" />
        <span
          v-if="projectCount > 0"
          class="absolute -top-1 -right-1 bg-tech-blue text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-tech-dark"
        >
          {{ projectCount }}
        </span>
      </button>
    </div>

    <!-- Search area (animates position via CSS transition) -->
    <div
      :class="[
        'w-full max-w-3xl transition-all duration-[600ms] ease-in-out',
        showFilters ? 'mb-8' : 'mt-[20vh] mb-[10vh]'
      ]"
    >
      <!-- Title (only when filters not shown) -->
      <Transition name="title-fade">
        <h1
          v-if="!showFilters"
          class="text-5xl font-bold text-center mb-8 tracking-tighter bg-gradient-to-r from-tech-blue to-white bg-clip-text text-transparent"
        >
          {{ CONTENT.radarPage.title }}
        </h1>
      </Transition>

      <!-- Search bar area (switches between folded and expanded) -->
      <Transition name="search-switch" mode="out-in">
        <!-- Folded search (when filters are shown) -->
        <div
          v-if="showFilters"
          key="folded-search"
          class="flex justify-center"
        >
          <button
            @click="emit('resetSearch')"
            class="bg-tech-dark/60 border border-tech-blue/30 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-tech-blue/10 transition-colors text-tech-blue group"
          >
            <Search :size="18" />
            <span class="text-sm font-medium truncate max-w-[300px]">{{ searchQuery }}</span>
            <div class="w-px h-4 bg-tech-blue/20 mx-2" />
            <span class="text-xs text-white/40 group-hover:text-tech-blue transition-colors">{{ CONTENT.radarPage.expandSearch }}</span>
          </button>
        </div>

        <!-- Expanded search (when filters not shown) -->
        <div v-else key="expanded-search" class="relative group">
          <div class="absolute -inset-1 bg-tech-blue opacity-20 blur-lg group-focus-within:opacity-40 transition duration-500"></div>
          <div class="relative bg-tech-dark/80 border border-tech-blue/30 rounded-2xl p-4 flex flex-col gap-4 backdrop-blur-xl">
            <!-- Voice analyzing state -->
            <div v-if="isAnalyzingVoice" class="h-[100px] flex flex-col items-center justify-center gap-3">
              <div class="flex gap-1">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="w-1 bg-tech-blue rounded-full voice-bar"
                  :style="{ animationDelay: `${i * 0.1}s` }"
                />
              </div>
              <span class="text-xs text-tech-blue animate-pulse">{{ CONTENT.common.voiceAnalyzing }}</span>
            </div>

            <!-- Search input -->
            <SearchInput
              v-else
              :model-value="searchQuery"
              @update:model-value="updateSearchQuery"
              :placeholder="searchPlaceholder"
            />

            <!-- Bottom row: voice + search button -->
            <div class="flex justify-between items-center">
              <button
                @click="handleVoiceToggle"
                :class="[
                  'p-2 rounded-full transition-all relative',
                  isVoiceInputActive
                    ? 'bg-red-500/20 text-red-500'
                    : 'hover:bg-tech-blue/10 text-tech-blue'
                ]"
              >
                <div
                  v-if="isVoiceInputActive"
                  class="voice-ripple absolute inset-0 bg-red-500 rounded-full"
                />
                <Mic :size="24" />
              </button>
              <button
                @click="emit('search')"
                :disabled="isAnalyzingSearch"
                class="bg-tech-blue text-black px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              >
                <div
                  v-if="isAnalyzingSearch"
                  class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"
                />
                <Search v-else :size="20" />
                {{ CONTENT.radarPage.aiAnalysis }}
              </button>
            </div>
          </div>

          <!-- Analyzing overlay -->
          <Transition name="fade">
            <div
              v-if="isAnalyzingSearch"
              class="absolute inset-0 bg-tech-dark/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-10"
            >
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-tech-blue/20 border-t-tech-blue rounded-full animate-spin" />
                <Sparkles class="absolute inset-0 m-auto text-tech-blue animate-pulse" :size="24" />
              </div>
              <span class="text-tech-blue font-bold tracking-widest text-sm">{{ CONTENT.common.aiAnalyzing }}</span>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <!-- Filters section -->
    <Transition name="filters-slide">
      <div
        v-if="showFilters"
        class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <!-- Left: Filters -->
        <div class="md:col-span-2 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
            <Filter :size="20" /> {{ CONTENT.radarPage.filters.title }}
          </h2>

          <div class="space-y-6">
            <!-- Tags -->
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.tags }} {{ CONTENT.common.multiSelect }}</span>
                <button
                  @click="emit('openTagModal')"
                  class="text-xs text-tech-blue flex items-center gap-1 hover:underline"
                >
                  <Plus :size="12" /> {{ CONTENT.radarPage.filters.moreTags }}
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in filters.tags"
                  :key="tag"
                  @click="removeTag(tag)"
                  class="px-3 py-1 rounded-lg text-sm border border-tech-blue bg-tech-blue text-black transition-all"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- Price -->
            <FilterRow
              :label="CONTENT.radarPage.filters.price"
              :options="CONTENT.radarPage.filters.priceOptions"
              :model-value="filters.price"
              @update:model-value="updatePrice"
            />

            <!-- Followers -->
            <FilterRow
              :label="CONTENT.radarPage.filters.followers"
              :options="CONTENT.radarPage.filters.followerOptions"
              :model-value="filters.followers"
              @update:model-value="updateFollowers"
            />

            <!-- Region -->
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.region }} {{ CONTENT.common.multiSelect }}</span>
                <button
                  @click="emit('openCityModal')"
                  class="text-xs text-tech-blue flex items-center gap-1 hover:underline"
                >
                  <Plus :size="12" /> {{ CONTENT.radarPage.filters.moreRegions }}
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="city in CITIES.hot"
                  :key="city"
                  @click="toggleRegion(city)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm border transition-all',
                    filters.region.includes(city)
                      ? 'bg-tech-blue text-black border-tech-blue'
                      : 'border-white/10 hover:border-tech-blue/50'
                  ]"
                >
                  {{ city }}
                </button>
              </div>
            </div>

            <!-- Content Type -->
            <div class="flex flex-col gap-2">
              <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.contentType }} {{ CONTENT.common.multiSelect }}</span>
              <div class="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  v-for="type in CONTENT_TYPES"
                  :key="type"
                  @click="toggleContentType(type)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm border transition-all',
                    filters.type.includes(type)
                      ? 'bg-tech-blue text-black border-tech-blue'
                      : 'border-white/10 hover:border-tech-blue/50'
                  ]"
                >
                  {{ type }}
                </button>
              </div>
            </div>
          </div>

          <!-- Start search button -->
          <button
            @click="emit('startSearch')"
            class="w-full mt-10 bg-tech-blue/10 border border-tech-blue text-tech-blue py-4 rounded-2xl font-bold text-xl hover:bg-tech-blue hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            {{ CONTENT.radarPage.filters.startSearch }}
          </button>
        </div>

        <!-- Right: AI Recommendation -->
        <div class="bg-tech-blue/5 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 :size="120" />
          </div>
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-tech-blue">
            <Info :size="20" /> {{ CONTENT.radarPage.aiRecommendation.title }}
          </h2>
          <div class="space-y-4 text-white/80 leading-relaxed">
            <p>
              {{ CONTENT.radarPage.aiRecommendation.intro }}
              <span class="text-tech-blue">"{{ searchQuery.slice(0, 15) }}..."</span>
              {{ CONTENT.radarPage.aiRecommendation.requirements }}
            </p>
            <p>{{ CONTENT.radarPage.aiRecommendation.locationRec }}</p>
            <p>{{ CONTENT.radarPage.aiRecommendation.typeRec }}</p>
            <div class="pt-4 border-t border-tech-blue/10">
              <p class="text-sm italic opacity-60">{{ CONTENT.radarPage.aiRecommendation.footer }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Page enter animation */
.radar-page-enter {
  animation: radar-fade-in 0.4s ease-out;
}

@keyframes radar-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Title fade transition */
.title-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.title-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.title-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.title-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Search switch transition (out-in mode) */
.search-switch-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.search-switch-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.search-switch-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.search-switch-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Fade transition (for analyzing overlay) */
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Filters slide-up transition */
.filters-slide-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.filters-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.filters-slide-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.filters-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Voice analyzing bars */
.voice-bar {
  height: 10px;
  animation: voice-bar-bounce 0.5s ease-in-out infinite alternate;
}

@keyframes voice-bar-bounce {
  0% {
    height: 10px;
  }
  100% {
    height: 30px;
  }
}

/* Voice ripple effect */
.voice-ripple {
  animation: voice-ripple-pulse 1s ease-out infinite;
}

@keyframes voice-ripple-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
