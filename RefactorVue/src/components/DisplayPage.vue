<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import {
  Search, Mic, ChevronRight, ChevronLeft,
  Heart, ArrowLeft, Plus, X,
  MapPin, Radar, Sparkles, Send,
  TrendingUp, Layers, MessageSquare
} from 'lucide-vue-next'
import { MOCK_INFLUENCERS, type Influencer, type Post } from '../types'
import { CONTENT } from '../content'

const props = defineProps<{
  isRadarScanning: boolean
  projectCount: number
  searchQuery: string
  isVoiceInputActive: boolean
  isAnalyzingVoice: boolean
}>()

const emit = defineEmits<{
  back: []
  openProjects: []
  selectInfluencer: [inf: Influencer]
  selectPost: [inf: Influencer, post: Post]
  startRadar: []
  approve: [influencers: Influencer[]]
  reject: [influencers: Influencer[]]
  'update:searchQuery': [value: string]
  'update:isVoiceInputActive': [value: boolean]
  'update:isAnalyzingVoice': [value: boolean]
}>()

const page = ref(0)
const showWall = ref(!props.isRadarScanning)
const avatarPositions = ref<{ x: number; y: number; scale: number }[]>([])
const visibleAvatarsCount = ref(0)
const progressText = ref(CONTENT.common.aiAnalyzing)
const containerVisible = ref(false)

const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(MOCK_INFLUENCERS.length / itemsPerPage))
const currentItems = computed(() =>
  MOCK_INFLUENCERS.slice(page.value * itemsPerPage, (page.value + 1) * itemsPerPage)
)
const paginationPages = computed(() => Math.min(5, totalPages.value))
const visibleAvatars = computed(() => MOCK_INFLUENCERS.slice(0, visibleAvatarsCount.value))

// Fade-in on mount
setTimeout(() => { containerVisible.value = true }, 0)

// Cleanup timers
let textInterval: ReturnType<typeof setInterval> | null = null
let appearanceTimers: ReturnType<typeof setTimeout>[] = []
let wallTimer: ReturnType<typeof setTimeout> | null = null

function clearAllTimers() {
  if (textInterval) { clearInterval(textInterval); textInterval = null }
  appearanceTimers.forEach(t => clearTimeout(t))
  appearanceTimers = []
  if (wallTimer) { clearTimeout(wallTimer); wallTimer = null }
}

watch(() => props.isRadarScanning, (scanning) => {
  clearAllTimers()

  if (scanning) {
    showWall.value = false
    visibleAvatarsCount.value = 0

    const positions = MOCK_INFLUENCERS.slice(0, 15).map(() => {
      const angle = Math.random() * Math.PI * 2
      const dist = 50 + Math.random() * 130
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 0.5 + Math.random() * 0.5
      }
    })
    avatarPositions.value = positions

    const statusTexts = CONTENT.displayPage.statusTexts
    let textIdx = 0
    textInterval = setInterval(() => {
      progressText.value = statusTexts[textIdx % statusTexts.length]
      textIdx++
    }, 3000)

    const appearanceTimes = [2000, 4000, 6000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000]
    appearanceTimers = appearanceTimes.map((time, i) =>
      setTimeout(() => {
        visibleAvatarsCount.value = i + 1
      }, time)
    )

    wallTimer = setTimeout(() => { showWall.value = true }, 20000)
  } else {
    showWall.value = true
  }
}, { immediate: true })

onBeforeUnmount(() => {
  clearAllTimers()
})

function onSearchInput(e: Event) {
  emit('update:searchQuery', (e.target as HTMLInputElement).value)
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') emit('startRadar')
}

function prevPage() {
  if (page.value > 0) page.value--
}

function nextPage() {
  if (page.value < totalPages.value - 1) page.value++
}

function getAvatarPosition(index: number) {
  const pos = avatarPositions.value[index] || { x: 0, y: 0, scale: 0.8 }
  return {
    transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`,
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}
</script>

<template>
  <div
    class="container mx-auto px-4 py-10 min-h-screen flex flex-col relative overflow-hidden display-page-container"
    :class="{ 'display-page-visible': containerVisible }"
  >
    <!-- Header -->
    <header class="flex justify-between items-center mb-12 z-20">
      <button
        @click="emit('back')"
        class="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
      >
        <ArrowLeft :size="24" />
      </button>

      <div class="text-center flex flex-col items-center gap-2">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-bold tracking-widest text-tech-blue">{{ CONTENT.displayPage.title }}</h1>
          <button
            @click="emit('startRadar')"
            class="p-2 bg-tech-blue/20 rounded-full text-tech-blue hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,255,0.3)]"
          >
            <Radar :size="24" :class="isRadarScanning ? 'animate-spin' : ''" />
          </button>
        </div>
        <p class="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">{{ CONTENT.displayPage.subtitle }}</p>

        <!-- Supplementary Search Bar -->
        <Transition name="fade-slide">
          <div v-if="showWall" class="relative w-full max-w-md group mt-2">
            <div class="absolute -inset-1 bg-tech-blue/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div class="relative flex items-center bg-tech-dark/80 border border-tech-blue/30 rounded-2xl px-4 py-1.5 backdrop-blur-md">
              <Search class="text-tech-blue mr-3" :size="16" />
              <input
                type="text"
                :value="searchQuery"
                @input="onSearchInput"
                @keydown="onSearchKeydown"
                :placeholder="CONTENT.common.radarPlaceholder"
                class="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20"
              />
              <div class="flex items-center gap-1">
                <button
                  @click="emit('update:isVoiceInputActive', true)"
                  :class="[
                    'p-2 rounded-xl transition-all',
                    isVoiceInputActive ? 'bg-red-500/20 text-red-500' : 'hover:bg-tech-blue/10 text-tech-blue'
                  ]"
                >
                  <Mic :size="16" />
                </button>
                <button
                  @click="emit('startRadar')"
                  class="p-2 text-tech-blue hover:bg-tech-blue/10 rounded-xl transition-colors"
                >
                  <Send :size="16" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

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
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center relative">
      <!-- Radar scanning animation -->
      <Transition name="fade">
        <div
          v-if="isRadarScanning && !showWall"
          class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <div class="relative w-[450px] h-[450px]">
            <!-- Radar circles -->
            <div
              v-for="i in 3"
              :key="i"
              class="absolute inset-0 border border-tech-blue/10 rounded-full"
              :style="{ margin: `${i * 60}px` }"
            />

            <!-- Outer circle -->
            <div class="absolute inset-0 border-2 border-tech-blue/20 rounded-full" />

            <!-- Sweep line - rotating -->
            <div class="absolute inset-0 rounded-full radar-sweep">
              <div class="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-1/2 bg-gradient-to-t from-tech-blue to-transparent origin-bottom shadow-[0_0_15px_var(--color-tech-blue)]" />
              <div
                class="absolute top-0 left-1/2 -ml-[100px] w-[200px] h-1/2 bg-tech-blue/10 origin-bottom rounded-t-full blur-xl"
                style="transform: rotate(-15deg)"
              />
            </div>

            <!-- Avatars appearing -->
            <div
              v-for="(inf, i) in visibleAvatars"
              :key="inf.id"
              class="absolute top-1/2 left-1/2 -ml-6 -mt-6"
              :style="getAvatarPosition(i)"
            >
              <div class="relative">
                <img
                  :src="inf.avatar"
                  class="w-12 h-12 rounded-full border border-tech-blue/50 object-cover shadow-[0_0_10px_rgba(0,242,255,0.3)]"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute -inset-1 border border-tech-blue rounded-full animate-pulse" />
              </div>
            </div>

            <!-- Progress text -->
            <div class="absolute bottom-[-100px] left-1/2 -translate-x-1/2 z-30 w-full max-w-lg">
              <div class="bg-tech-dark/90 px-6 py-4 rounded-2xl border border-tech-blue/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                <div class="text-tech-blue font-bold tracking-wide text-sm flex items-start gap-3">
                  <Sparkles :size="18" class="shrink-0 mt-0.5" />
                  <div class="flex flex-col gap-1">
                    <span class="text-xs uppercase opacity-50 tracking-[0.2em]">{{ CONTENT.displayPage.matchAnalysis }}</span>
                    <span class="leading-relaxed">{{ progressText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Results Wall -->
      <Transition name="fade-up">
        <div v-if="showWall" class="flex flex-col items-center w-full max-w-7xl px-4 md:px-12">
          <div class="w-full space-y-8 mb-12">
            <div class="flex flex-col gap-8">
              <div
                v-for="(inf, idx) in currentItems"
                :key="inf.id"
                class="bg-tech-dark/40 border border-tech-blue/20 rounded-3xl p-8 backdrop-blur-md flex flex-col lg:flex-row gap-10 group hover:border-tech-blue/50 transition-all relative overflow-hidden result-card"
                :style="{ animationDelay: `${idx * 0.1}s` }"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-tech-blue/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-tech-blue/10 transition-colors" />

                <!-- Left: Basic Info -->
                <div class="flex flex-col items-center text-center lg:w-56 shrink-0 border-r border-white/5 pr-0 lg:pr-10">
                  <div
                    class="relative mb-6 cursor-pointer group/avatar"
                    @click="emit('selectInfluencer', inf)"
                  >
                    <div class="absolute -inset-2 bg-tech-blue/30 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                    <img
                      :src="inf.avatar"
                      class="w-28 h-28 rounded-full border-2 border-tech-blue/30 group-hover/avatar:border-tech-blue transition-colors object-cover relative z-10 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                      referrerpolicy="no-referrer"
                    />
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {{ inf.fitScore }}% {{ CONTENT.displayPage.fitScore }}
                    </div>
                  </div>
                  <h3 class="text-2xl font-bold mb-2 group-hover:text-tech-blue transition-colors">{{ inf.name }}</h3>
                  <div class="flex items-center gap-2 text-white/40 text-sm mb-6">
                    <MapPin :size="14" /> {{ inf.region }} &middot; {{ inf.type }}
                  </div>
                  <div class="grid grid-cols-2 gap-4 w-full mb-8">
                    <div class="bg-white/5 p-3 rounded-2xl text-center">
                      <div class="text-xs text-white/40 mb-1">{{ CONTENT.resultsPage.table.followers }}</div>
                      <div class="text-sm font-bold text-tech-blue">{{ (inf.followers / 10000).toFixed(1) }}W</div>
                    </div>
                    <div class="bg-white/5 p-3 rounded-2xl text-center">
                      <div class="text-xs text-white/40 mb-1">{{ CONTENT.resultsPage.table.price }}</div>
                      <div class="text-sm font-bold text-tech-blue">&yen;{{ inf.price.toLocaleString() }}</div>
                    </div>
                  </div>
                  <div class="flex gap-4 w-full mb-8">
                    <button
                      @click="emit('approve', [inf])"
                      class="flex-1 py-3 bg-tech-blue text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                      <Plus :size="18" /> {{ CONTENT.project.approve }}
                    </button>
                    <button
                      @click="emit('reject', [inf])"
                      class="flex-1 py-3 border border-red-500/50 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <X :size="18" /> {{ CONTENT.project.reject }}
                    </button>
                  </div>
                </div>

                <!-- Middle: AI Analysis -->
                <div class="flex-1 flex flex-col gap-8">
                  <div class="space-y-4">
                    <h4 class="text-lg font-bold text-tech-blue flex items-center gap-2">
                      <Sparkles :size="20" /> {{ CONTENT.displayPage.matchReason }}
                    </h4>
                    <div class="relative">
                      <div class="absolute -left-4 top-0 bottom-0 w-1 bg-tech-blue/30 rounded-full" />
                      <p class="text-base text-white/80 leading-relaxed italic pl-4">"{{ inf.posts[0].matchAnalysis }}"</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <h4 class="text-sm font-bold text-white/60 uppercase tracking-wider">{{ CONTENT.displayPage.intro }}</h4>
                    <p class="text-sm text-white/50 leading-relaxed">{{ inf.intro }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2 pt-4">
                    <span
                      v-for="tag in inf.tags"
                      :key="tag"
                      class="px-3 py-1.5 bg-tech-blue/10 border border-tech-blue/20 rounded-xl text-xs text-tech-blue"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Right: Post Preview -->
                <div class="lg:w-72 shrink-0 flex flex-col">
                  <h4 class="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">{{ CONTENT.displayPage.postPreview }}</h4>
                  <div
                    class="relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer group/post flex-1 shadow-2xl"
                    @click="emit('selectPost', inf, inf.posts[0])"
                  >
                    <img
                      :src="inf.posts[0].images[0]"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover/post:scale-110"
                      referrerpolicy="no-referrer"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <p class="text-sm text-white/90 line-clamp-3 mb-4 font-medium leading-relaxed">{{ inf.posts[0].text }}</p>
                      <div class="flex justify-between items-center text-xs text-tech-blue font-bold bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                        <span class="flex items-center gap-1.5"><TrendingUp :size="14" /> {{ inf.posts[0].views.toLocaleString() }}</span>
                        <span class="flex items-center gap-1.5"><Heart :size="14" /> {{ inf.posts[0].likes.toLocaleString() }}</span>
                        <span class="flex items-center gap-1.5"><MessageSquare :size="14" /> {{ inf.posts[0].comments.toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between w-full py-8 border-t border-white/10">
            <div class="text-sm text-white/40">
              {{ CONTENT.common.showing }} {{ page * itemsPerPage + 1 }} - {{ Math.min((page + 1) * itemsPerPage, MOCK_INFLUENCERS.length) }} {{ CONTENT.common.of }} {{ MOCK_INFLUENCERS.length }} {{ CONTENT.common.unit }}
            </div>
            <div class="flex gap-3">
              <button
                :disabled="page === 0"
                @click="prevPage"
                class="p-3 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-colors text-white/60"
              >
                <ChevronLeft :size="24" />
              </button>
              <div class="flex gap-2">
                <button
                  v-for="i in paginationPages"
                  :key="i - 1"
                  @click="page = i - 1"
                  :class="[
                    'w-12 h-12 rounded-2xl text-sm font-bold transition-all',
                    page === i - 1
                      ? 'bg-tech-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                      : 'hover:bg-white/5 text-white/40 border border-white/5'
                  ]"
                >
                  {{ i }}
                </button>
              </div>
              <button
                :disabled="page === totalPages - 1"
                @click="nextPage"
                class="p-3 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-colors text-white/60"
              >
                <ChevronRight :size="24" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Footer -->
    <Transition name="fade">
      <footer v-if="showWall" class="mt-12 text-center">
        <div class="inline-flex items-center gap-4 px-6 py-2 bg-tech-blue/10 border border-tech-blue/20 rounded-full backdrop-blur-md">
          <span class="text-white/40">{{ CONTENT.common.total }}: <span class="text-tech-blue font-bold">{{ MOCK_INFLUENCERS.length }}</span></span>
          <div class="w-px h-4 bg-tech-blue/20" />
          <span class="text-white/40">{{ CONTENT.common.page }} <span class="text-tech-blue font-bold">{{ page + 1 }}</span> / {{ totalPages }} {{ CONTENT.common.page }}</span>
        </div>
      </footer>
    </Transition>
  </div>
</template>

<style scoped>
/* Container fade-in (replaces framer-motion initial/animate) */
.display-page-container {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.display-page-container.display-page-visible {
  opacity: 1;
}

/* Radar sweep rotation */
.radar-sweep {
  animation: radar-spin 3s linear infinite;
}
@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Result card entrance */
.result-card {
  animation: card-fade-in 0.5s ease both;
}
@keyframes card-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transition: fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition: fade-slide (search bar) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Transition: fade-up (results wall) */
.fade-up-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
