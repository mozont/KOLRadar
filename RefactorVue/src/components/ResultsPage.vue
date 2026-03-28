<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import {
  Filter, ChevronRight, ChevronLeft,
  ArrowLeft, Plus, X,
  Tag, Radar, Layers, Loader2, CheckCircle2, Sparkles
} from 'lucide-vue-next';
import { MOCK_INFLUENCERS, Influencer, Post, CITIES, CONTENT_TYPES, Project, RejectionRecord } from '../types';
import { CONTENT } from '../content';
import FilterRow from './FilterRow.vue';

interface Filters {
  tags: string[];
  price: string;
  followers: string;
  region: string[];
  type: string[];
}

const props = defineProps<{
  filters: Filters;
  projectCount: number;
  projects: Project[];
  rejections: RejectionRecord[];
  skipLoading: boolean;
  matchedIds: string[];
  standardizedConditions: string[];
}>();

const emit = defineEmits<{
  back: [];
  openProjects: [];
  selectInfluencer: [inf: Influencer];
  selectPrecisionInfluencer: [inf: Influencer];
  selectPost: [inf: Influencer, post: Post];
  startRadar: [];
  approve: [infs: Influencer[]];
  reject: [infs: Influencer[]];
  removeFromProject: [id: string];
  removeFromRejections: [id: string];
  openTagModal: [];
  openCityModal: [];
  'update:filters': [value: Filters];
  'update:matchedIds': [value: string[]];
  'update:standardizedConditions': [value: string[]];
}>();

// Local state
const isLoading = ref(!props.skipLoading);
const sortBy = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc' | null>(null);
const page = ref(0);
const selectedIds = ref<string[]>([]);
const itemsPerPage = 10;

// Precision Search State
const precisionPrompt = ref('');
const isAnalyzingPrecision = ref(false);
const isScanning = ref(false);
const scanningId = ref<string | null>(null);
const displayedInfluencers = ref<Influencer[]>(MOCK_INFLUENCERS);
const isPrecisionModalOpen = ref(false);
const quickFilter = ref<'all' | 'precision' | 'standard' | 'approved' | 'rejected'>('all');
const modalConditions = ref<string[]>([]);

// Sync modalConditions when modal opens
watch([isPrecisionModalOpen, () => props.standardizedConditions], ([open]) => {
  if (open) {
    modalConditions.value = [...props.standardizedConditions];
  }
});

// Loading timer
let loadingTimer: ReturnType<typeof setTimeout> | undefined;
if (!props.skipLoading) {
  loadingTimer = setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}
onUnmounted(() => {
  if (loadingTimer) clearTimeout(loadingTimer);
});

// Filter logic
const handleFilter = () => {
  isLoading.value = true;
  setTimeout(() => {
    const filtered = MOCK_INFLUENCERS.filter(inf => {
      // Region filter
      if (props.filters.region.length > 0 && !props.filters.region.includes(CONTENT.common.unlimited)) {
        if (!props.filters.region.includes(inf.region)) return false;
      }
      // Type filter
      if (props.filters.type.length > 0 && !props.filters.type.includes(CONTENT.common.unlimited)) {
        if (!props.filters.type.includes(inf.type)) return false;
      }
      // Tags filter
      if (props.filters.tags.length > 0) {
        if (!props.filters.tags.some((tag: string) => inf.tags.includes(tag))) return false;
      }
      // Price filter
      if (props.filters.price !== CONTENT.common.unlimited) {
        if (props.filters.price === "2000以下" && inf.price >= 2000) return false;
        if (props.filters.price === "2000-5000" && (inf.price < 2000 || inf.price > 5000)) return false;
        if (props.filters.price === "5000-1W" && (inf.price < 5000 || inf.price > 10000)) return false;
        if (props.filters.price === "1W-5W" && (inf.price < 10000 || inf.price > 50000)) return false;
        if (props.filters.price === "5W-10W" && (inf.price < 50000 || inf.price > 100000)) return false;
        if (props.filters.price === "10W以上" && inf.price < 100000) return false;
      }
      // Followers filter
      if (props.filters.followers !== CONTENT.common.unlimited) {
        if (props.filters.followers === "50W以下" && inf.followers >= 500000) return false;
        if (props.filters.followers === "50W-100W" && (inf.followers < 500000 || inf.followers > 1000000)) return false;
        if (props.filters.followers === "100W-200W" && (inf.followers < 1000000 || inf.followers > 2000000)) return false;
        if (props.filters.followers === "200W-300W" && (inf.followers < 2000000 || inf.followers > 3000000)) return false;
        if (props.filters.followers === "300W-500W" && (inf.followers < 3000000 || inf.followers > 5000000)) return false;
        if (props.filters.followers === "500W-1000W" && (inf.followers < 5000000 || inf.followers > 10000000)) return false;
        if (props.filters.followers === "1000W-3000W" && (inf.followers < 10000000 || inf.followers > 30000000)) return false;
        if (props.filters.followers === "3000W以上" && inf.followers < 30000000) return false;
      }
      return true;
    });
    displayedInfluencers.value = filtered;
    isLoading.value = false;
    page.value = 0;
  }, 2000);
};

// Unified precision search
const handleUnifiedSearch = async (conditionsFromModal?: string[]) => {
  const baseConditions = conditionsFromModal || props.standardizedConditions;
  if (!precisionPrompt.value.trim() && baseConditions.length === 0) return;

  // Step 1: Standardize conditions
  isAnalyzingPrecision.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));

  let finalConditions = [...baseConditions];
  if (precisionPrompt.value.trim()) {
    const extracted = precisionPrompt.value
      .split(/[，, ]+/)
      .filter(c => c.length > 1 && !finalConditions.includes(c))
      .slice(0, 3);
    if (extracted.length > 0) {
      finalConditions = [...finalConditions, ...extracted];
    } else if (finalConditions.length === 0) {
      finalConditions = ["背景干净", "光线明亮", "露脸自拍"];
    }
  }

  emit('update:standardizedConditions', finalConditions);
  precisionPrompt.value = '';
  isAnalyzingPrecision.value = false;

  // Step 2: Advanced Search
  isScanning.value = true;
  emit('update:matchedIds', []);

  const newMatchedIds: string[] = [];
  for (const inf of displayedInfluencers.value) {
    scanningId.value = inf.id;
    await new Promise(resolve => setTimeout(resolve, 600));
    if (Math.random() > 0.4) {
      newMatchedIds.push(inf.id);
      emit('update:matchedIds', [...newMatchedIds]);
    }
  }

  scanningId.value = null;
  isScanning.value = false;
};

// Sort logic
const handleSort = (id: string) => {
  if (sortBy.value === id) {
    if (sortOrder.value === 'desc') {
      sortOrder.value = 'asc';
    } else if (sortOrder.value === 'asc') {
      sortBy.value = null;
      sortOrder.value = null;
    }
  } else {
    sortBy.value = id;
    sortOrder.value = 'desc';
  }
};

// Computed values
const sortedInfluencers = computed(() => {
  return [...displayedInfluencers.value].sort((a, b) => {
    if (!sortBy.value || !sortOrder.value) return 0;
    let valA = (a as any)[sortBy.value];
    let valB = (b as any)[sortBy.value];

    if (sortBy.value === 'views') {
      valA = a.posts.reduce((sum: number, p: Post) => sum + p.views, 0);
      valB = b.posts.reduce((sum: number, p: Post) => sum + p.views, 0);
    } else if (sortBy.value === 'posts') {
      valA = a.posts.length;
      valB = b.posts.length;
    }

    if (sortOrder.value === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });
});

const filteredByQuick = computed(() => {
  return sortedInfluencers.value.filter(inf => {
    if (quickFilter.value === 'all') return true;
    if (quickFilter.value === 'precision') return props.matchedIds.includes(inf.id);
    if (quickFilter.value === 'standard') return !props.matchedIds.includes(inf.id);
    if (quickFilter.value === 'approved') return props.projects.some((p: Project) => p.influencers.some(item => item.id === inf.id));
    if (quickFilter.value === 'rejected') return props.rejections.some((r: RejectionRecord) => r.influencerId === inf.id);
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredByQuick.value.length / itemsPerPage));

const currentItems = computed(() => {
  return filteredByQuick.value.slice(page.value * itemsPerPage, (page.value + 1) * itemsPerPage);
});

const counts = computed(() => ({
  all: displayedInfluencers.value.length,
  precision: displayedInfluencers.value.filter(inf => props.matchedIds.includes(inf.id)).length,
  standard: displayedInfluencers.value.filter(inf => !props.matchedIds.includes(inf.id)).length,
  approved: displayedInfluencers.value.filter(inf => props.projects.some((p: Project) => p.influencers.some(item => item.id === inf.id))).length,
  rejected: displayedInfluencers.value.filter(inf => props.rejections.some((r: RejectionRecord) => r.influencerId === inf.id)).length,
}));

// Selection logic
const toggleSelectAll = () => {
  if (selectedIds.value.length === currentItems.value.length) {
    selectedIds.value = [];
  } else {
    selectedIds.value = currentItems.value.map(i => i.id);
  }
};

const toggleSelect = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
};

const handleBatchApprove = () => {
  const selectedInfs = MOCK_INFLUENCERS.filter(i => selectedIds.value.includes(i.id));
  emit('approve', selectedInfs);
};

const handleBatchContact = () => {
  alert(CONTENT.project.batchContact + ': ' + selectedIds.value.length + ' ' + CONTENT.resultsPage.unit);
};

// Filter helpers
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

function removeModalCondition(idx: number) {
  modalConditions.value = modalConditions.value.filter((_, i) => i !== idx);
}

function isApproved(inf: Influencer): boolean {
  return props.projects.some((p: Project) => p.influencers.some(item => item.id === inf.id));
}

// Quick filter tabs data
const quickFilterTabs = [
  { id: 'all' as const, label: '全部' },
  { id: 'precision' as const, label: '精准筛选' },
  { id: 'standard' as const, label: '普通筛选' },
  { id: 'approved' as const, label: '通过' },
  { id: 'rejected' as const, label: '不通过' },
];
</script>

<template>
  <!-- Loading State -->
  <Transition name="fade" mode="out-in">
    <div
      v-if="isLoading"
      key="loading"
      class="container mx-auto px-4 h-screen flex flex-col items-center justify-center"
    >
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 border-4 border-tech-blue/20 border-t-tech-blue rounded-full animate-spin" />
        <Loader2 class="absolute inset-0 m-auto text-tech-blue animate-spin" :size="32" />
      </div>
      <h2 class="text-2xl font-bold text-tech-blue tracking-widest animate-pulse">{{ CONTENT.common.loadingData }}</h2>
    </div>

    <!-- Main Content -->
    <div
      v-else
      key="content"
      class="results-page-enter container mx-auto px-4 py-10 min-h-screen flex flex-col"
    >
      <!-- Header -->
      <header class="flex justify-between items-center mb-12">
        <div class="flex items-center gap-6">
          <button
            @click="emit('back')"
            class="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
          >
            <ArrowLeft :size="24" />
          </button>
          <div>
            <h1 class="text-3xl font-bold tracking-widest text-tech-blue">{{ CONTENT.resultsPage.title }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="emit('startRadar')"
            class="p-4 bg-tech-blue/10 border border-tech-blue/50 rounded-full hover:bg-tech-blue hover:text-black transition-all text-tech-blue flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Radar :size="24" class="animate-pulse" />
            <span class="font-bold">{{ CONTENT.resultsPage.startRadar }}</span>
          </button>

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
      </header>

      <!-- Filters Section -->
      <div class="mb-8 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-6 backdrop-blur-md">
        <div class="flex flex-col gap-6">
          <!-- Tags -->
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.tags }}</span>
              <button
                @click="emit('openTagModal')"
                class="text-sm text-tech-blue flex items-center gap-1 hover:underline"
              >
                <Plus :size="10" /> {{ CONTENT.radarPage.filters.moreTags }}
              </button>
            </div>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="tag in filters.tags"
                :key="tag"
                @click="removeTag(tag)"
                class="px-2 py-0.5 rounded text-sm border border-tech-blue bg-tech-blue text-black transition-all"
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
              <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.region }}</span>
              <button
                @click="emit('openCityModal')"
                class="text-sm text-tech-blue flex items-center gap-1 hover:underline"
              >
                <Plus :size="10" /> {{ CONTENT.radarPage.filters.moreRegions }}
              </button>
            </div>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="city in CITIES.hot"
                :key="city"
                @click="toggleRegion(city)"
                :class="[
                  'px-2 py-0.5 rounded text-sm border transition-all',
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
          <div class="flex flex-col gap-2 lg:col-span-2">
            <span class="text-sm text-white/50">{{ CONTENT.radarPage.filters.contentType }}</span>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="type in CONTENT_TYPES"
                :key="type"
                @click="toggleContentType(type)"
                :class="[
                  'px-2 py-0.5 rounded text-sm border transition-all',
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

        <!-- Filter Execute Button -->
        <div class="mt-6 pt-6 border-t border-tech-blue/10 flex justify-center">
          <button
            @click="handleFilter"
            class="px-12 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Filter :size="18" />
            {{ CONTENT.radarPage.filters.filterButton }}
          </button>
        </div>
      </div>

      <!-- Main Table Container -->
      <div class="flex-1 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
        <!-- Quick Filters -->
        <div class="px-6 py-4 border-b border-tech-blue/10 flex flex-wrap gap-3 bg-tech-blue/5">
          <button
            v-for="f in quickFilterTabs"
            :key="f.id"
            @click="quickFilter = f.id; page = 0"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-bold transition-all border',
              quickFilter === f.id
                ? 'bg-tech-blue text-black border-tech-blue shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                : 'bg-tech-blue/5 text-tech-blue/60 border-tech-blue/20 hover:border-tech-blue/50 hover:text-tech-blue'
            ]"
          >
            {{ f.label }} ({{ counts[f.id] }})
          </button>
        </div>

        <!-- Batch Action Bar -->
        <div class="p-6 flex items-center justify-between bg-tech-blue/5 border-b-0">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-4 py-2 bg-tech-blue/10 rounded-xl border border-tech-blue/20">
              <span class="text-sm text-white/60">{{ CONTENT.common.selected }} <span class="text-tech-blue font-bold">{{ selectedIds.length }}</span></span>
            </div>
            <button
              @click="handleBatchApprove"
              :disabled="selectedIds.length === 0"
              class="px-6 py-2 bg-tech-blue text-black rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {{ CONTENT.project.batchApprove }}
            </button>
            <button
              @click="emit('reject', MOCK_INFLUENCERS.filter(i => selectedIds.includes(i.id)))"
              :disabled="selectedIds.length === 0"
              class="px-6 py-2 border border-red-500 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              {{ CONTENT.project.batchReject }}
            </button>

            <div class="h-6 w-px bg-white/10 mx-2" />

            <div class="flex items-center gap-4">
              <button
                @click="isPrecisionModalOpen = true"
                class="px-6 py-2 bg-tech-blue/10 border border-tech-blue/30 text-tech-blue rounded-xl font-bold text-sm hover:bg-tech-blue hover:text-black transition-all flex items-center gap-2"
              >
                <Sparkles :size="16" />
                {{ CONTENT.resultsPage.precisionSearch.title }}
              </button>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(cond, idx) in standardizedConditions"
                  :key="idx"
                  class="condition-tag px-3 py-1 bg-tech-blue/10 text-tech-blue text-xs rounded-full border border-tech-blue/20 flex items-center gap-1"
                >
                  <Tag :size="10" /> {{ cond }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-sm text-white/40">
            {{ CONTENT.resultsPage.totalFound }} <span class="text-tech-blue font-bold">{{ filteredByQuick.length }}</span> {{ CONTENT.resultsPage.unit }}
          </div>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-x-auto">
          <table class="w-full text-left border-collapse border-none">
            <thead class="bg-tech-blue/5 text-tech-blue text-xs uppercase tracking-wider select-none border-b-0">
              <tr>
                <th class="px-6 py-4 w-10">
                  <button
                    @click="toggleSelectAll"
                    :class="[
                      'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                      selectedIds.length === currentItems.length
                        ? 'bg-tech-blue border-tech-blue text-black'
                        : 'border-tech-blue/30 hover:border-tech-blue'
                    ]"
                  >
                    <Plus v-if="selectedIds.length === currentItems.length" :size="14" class="rotate-45" />
                  </button>
                </th>
                <th
                  class="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors"
                  @click="handleSort('name')"
                >
                  <div class="flex items-center gap-2">
                    {{ CONTENT.resultsPage.table.info }}
                    <ChevronRight
                      v-if="sortBy === 'name' && sortOrder === 'desc'"
                      class="rotate-90"
                      :size="14"
                    />
                    <ChevronRight
                      v-else-if="sortBy === 'name' && sortOrder === 'asc'"
                      class="-rotate-90"
                      :size="14"
                    />
                  </div>
                </th>
                <th class="px-6 py-4 font-bold">{{ CONTENT.resultsPage.table.regionType }}</th>
                <th
                  class="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors"
                  @click="handleSort('followers')"
                >
                  <div class="flex items-center gap-2">
                    {{ CONTENT.resultsPage.table.followers }}
                    <ChevronRight
                      v-if="sortBy === 'followers' && sortOrder === 'desc'"
                      class="rotate-90"
                      :size="14"
                    />
                    <ChevronRight
                      v-else-if="sortBy === 'followers' && sortOrder === 'asc'"
                      class="-rotate-90"
                      :size="14"
                    />
                  </div>
                </th>
                <th class="px-6 py-4 font-bold">{{ CONTENT.resultsPage.table.recentPosts }}</th>
                <th
                  class="px-6 py-4 font-bold cursor-pointer hover:bg-tech-blue/10 transition-colors"
                  @click="handleSort('posts')"
                >
                  <div class="flex items-center gap-2">
                    {{ CONTENT.resultsPage.table.postCount }}
                    <ChevronRight
                      v-if="sortBy === 'posts' && sortOrder === 'desc'"
                      class="rotate-90"
                      :size="14"
                    />
                    <ChevronRight
                      v-else-if="sortBy === 'posts' && sortOrder === 'asc'"
                      class="-rotate-90"
                      :size="14"
                    />
                  </div>
                </th>
                <th
                  class="px-6 py-4 font-bold text-right cursor-pointer hover:bg-tech-blue/10 transition-colors"
                  @click="handleSort('price')"
                >
                  <div class="flex items-center justify-end gap-2">
                    {{ CONTENT.resultsPage.table.price }}
                    <ChevronRight
                      v-if="sortBy === 'price' && sortOrder === 'desc'"
                      class="rotate-90"
                      :size="14"
                    />
                    <ChevronRight
                      v-else-if="sortBy === 'price' && sortOrder === 'asc'"
                      class="-rotate-90"
                      :size="14"
                    />
                  </div>
                </th>
                <th class="px-6 py-4 font-bold text-center">{{ CONTENT.resultsPage.table.action }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-tech-blue/30">
              <tr
                v-for="(inf, i) in currentItems"
                :key="inf.id"
                :class="[
                  'hover:bg-white/5 transition-all group row-enter',
                  selectedIds.includes(inf.id) ? 'bg-tech-blue/5' : '',
                  scanningId === inf.id ? 'bg-tech-blue/10' : '',
                  matchedIds.includes(inf.id) ? 'bg-tech-blue/5' : ''
                ]"
                :style="{ animationDelay: `${i * 50}ms` }"
              >
                <!-- Checkbox -->
                <td class="px-6 py-4">
                  <button
                    @click="toggleSelect(inf.id)"
                    :class="[
                      'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                      selectedIds.includes(inf.id)
                        ? 'bg-tech-blue border-tech-blue text-black'
                        : 'border-tech-blue/30 hover:border-tech-blue'
                    ]"
                  >
                    <Plus v-if="selectedIds.includes(inf.id)" :size="14" class="rotate-45" />
                  </button>
                </td>

                <!-- Info (avatar + name + tags + match status) -->
                <td class="px-6 py-4">
                  <div
                    class="flex items-center gap-4 cursor-pointer"
                    @click="matchedIds.includes(inf.id) ? emit('selectPrecisionInfluencer', inf) : emit('selectInfluencer', inf)"
                  >
                    <div class="relative">
                      <img
                        :src="inf.avatar"
                        class="w-12 h-12 rounded-full border border-tech-blue/30 group-hover:border-tech-blue transition-colors"
                        referrerpolicy="no-referrer"
                      />
                      <div
                        v-if="scanningId === inf.id"
                        class="absolute -inset-1 border-2 border-transparent border-t-tech-blue rounded-full animate-spin"
                      />
                      <div
                        v-if="matchedIds.includes(inf.id)"
                        class="absolute -top-1 -right-1 bg-tech-blue text-black rounded-full p-0.5 shadow-lg"
                      >
                        <CheckCircle2 :size="10" />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold text-white group-hover:text-tech-blue transition-colors flex items-center gap-2">
                        {{ inf.name }}
                        <span
                          v-if="matchedIds.includes(inf.id)"
                          class="text-xs px-1.5 py-0.5 bg-tech-blue/20 text-tech-blue rounded-full font-normal"
                        >MATCHED</span>
                      </div>
                      <div class="flex gap-1 mt-1">
                        <span
                          v-for="tag in inf.tags.slice(0, 2)"
                          :key="tag"
                          class="text-xs px-1.5 py-0.5 bg-tech-blue/10 text-tech-blue rounded"
                        >#{{ tag }}</span>
                      </div>

                      <!-- Scanning / Matched info -->
                      <div
                        v-if="scanningId === inf.id || matchedIds.includes(inf.id)"
                        class="mt-2 pt-2 border-t border-tech-blue/10"
                      >
                        <!-- Scanning state -->
                        <div
                          v-if="scanningId === inf.id"
                          class="flex items-center gap-2 text-tech-blue text-xs"
                        >
                          <Loader2 class="animate-spin" :size="10" />
                          <span>{{ CONTENT.resultsPage.precisionSearch.scanning }}</span>
                        </div>
                        <!-- Matched state -->
                        <div v-else class="flex flex-col gap-1">
                          <div class="flex items-center gap-1 text-green-400 text-xs font-bold">
                            <CheckCircle2 :size="10" />
                            <span>{{ CONTENT.resultsPage.precisionSearch.matchImage }}</span>
                          </div>
                          <div class="flex flex-wrap gap-1">
                            <span
                              v-for="(c, idx) in standardizedConditions"
                              :key="idx"
                              class="text-xs text-tech-blue/60"
                            >#{{ c }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Region / Type -->
                <td class="px-6 py-4 text-sm text-white/60">
                  {{ inf.region }} · {{ inf.type }}
                </td>

                <!-- Followers -->
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-white">{{ (inf.followers / 10000).toFixed(1) }}W</div>
                </td>

                <!-- Recent Posts (image thumbnails) -->
                <td class="px-6 py-4">
                  <div class="flex -space-x-2 overflow-hidden">
                    <div
                      v-for="post in inf.posts.slice(0, 3)"
                      :key="post.id"
                      @click="emit('selectPost', inf, post)"
                      class="post-thumb w-10 h-10 rounded-lg border-2 border-tech-dark overflow-hidden cursor-pointer shadow-lg hover:scale-110 hover:z-10 transition-transform"
                    >
                      <img :src="post.images[0]" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                    </div>
                  </div>
                </td>

                <!-- Post Count -->
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-white">{{ inf.posts.length }}</div>
                </td>

                <!-- Price -->
                <td class="px-6 py-4 text-right">
                  <div class="text-sm font-bold text-tech-blue">¥{{ inf.price.toLocaleString() }}</div>
                </td>

                <!-- Action -->
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <button
                      v-if="isApproved(inf)"
                      @click="emit('removeFromProject', inf.id)"
                      class="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                    >
                      {{ CONTENT.project.cancelApprove }}
                    </button>
                    <template v-else>
                      <button
                        @click="emit('approve', [inf])"
                        class="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        :title="CONTENT.project.approve"
                      >
                        <Plus :size="18" />
                      </button>
                      <button
                        @click="emit('reject', [inf])"
                        class="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        :title="CONTENT.project.reject"
                      >
                        <X :size="18" />
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 border-t border-tech-blue/10 flex items-center justify-between bg-tech-blue/5">
          <div class="text-sm text-white/40">
            {{ CONTENT.common.showing }} {{ page * itemsPerPage + 1 }} - {{ Math.min((page + 1) * itemsPerPage, filteredByQuick.length) }} {{ CONTENT.common.of }} {{ filteredByQuick.length }} {{ CONTENT.common.unit }}
          </div>
          <div class="flex gap-2">
            <button
              :disabled="page === 0"
              @click="page = page - 1"
              class="p-2 border border-white/10 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
            >
              <ChevronLeft :size="20" />
            </button>
            <button
              v-for="i in totalPages"
              :key="i"
              @click="page = i - 1"
              :class="[
                'w-10 h-10 rounded-lg text-sm font-bold transition-all',
                page === i - 1
                  ? 'bg-tech-blue text-black'
                  : 'hover:bg-white/5 text-white/40'
              ]"
            >
              {{ i }}
            </button>
            <button
              :disabled="page === totalPages - 1"
              @click="page = page + 1"
              class="p-2 border border-white/10 rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Precision Search Modal -->
      <Transition name="modal">
        <div
          v-if="isPrecisionModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div class="bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,242,255,0.1)]">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-tech-blue flex items-center gap-2">
                <Sparkles /> {{ CONTENT.resultsPage.precisionSearch.title }}
              </h2>
              <button @click="isPrecisionModalOpen = false" class="text-white/50 hover:text-white">
                <X :size="24" />
              </button>
            </div>

            <div class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 focus-within:border-tech-blue/50 transition-colors">
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="(cond, idx) in modalConditions"
                  :key="idx"
                  class="px-3 py-1 bg-tech-blue/20 text-tech-blue text-xs rounded-full border border-tech-blue/30 flex items-center gap-2"
                >
                  {{ cond }}
                  <button
                    @click="removeModalCondition(idx)"
                    class="hover:text-white transition-colors p-0.5"
                  >
                    <X :size="14" />
                  </button>
                </span>
              </div>
              <textarea
                v-model="precisionPrompt"
                :placeholder="CONTENT.resultsPage.precisionSearch.placeholder"
                class="w-full bg-transparent border-none outline-none text-white transition-colors resize-none h-32 text-sm"
              />
            </div>

            <div class="flex justify-end gap-4">
              <button
                @click="isPrecisionModalOpen = false"
                class="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
              >
                {{ CONTENT.common.cancel }}
              </button>
              <button
                @click="handleUnifiedSearch(modalConditions); isPrecisionModalOpen = false"
                class="px-12 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
              >
                {{ CONTENT.radarPage.filters.filterButton.replace('执行', '') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Page enter animation */
.results-page-enter {
  animation: results-fade-in 0.4s ease-out;
}

@keyframes results-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Fade transition (loading / content switch) */
.fade-enter-active {
  transition: opacity 0.4s ease;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal transition */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from > div {
  transform: scale(0.9);
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}

/* Row enter animation */
.row-enter {
  animation: row-fade-in 0.3s ease-out both;
}

@keyframes row-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Condition tag animation */
.condition-tag {
  animation: condition-pop-in 0.3s ease-out;
}

@keyframes condition-pop-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Post thumbnail hover */
.post-thumb {
  transition: transform 0.2s ease, z-index 0s;
}
</style>
