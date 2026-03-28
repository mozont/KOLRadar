<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Background from './components/Background.vue'
import RadarPage from './components/RadarPage.vue'
import ResultsPage from './components/ResultsPage.vue'
import DisplayPage from './components/DisplayPage.vue'
import ProjectsPage from './components/ProjectsPage.vue'
import InfluencerDetailModal from './components/InfluencerDetailModal.vue'
import PostDetailModal from './components/PostDetailModal.vue'
import TagSelectionModal from './components/TagSelectionModal.vue'
import CitySelectionModal from './components/CitySelectionModal.vue'
import ProjectSelectionModal from './components/ProjectSelectionModal.vue'
import RejectionReasonModal from './components/RejectionReasonModal.vue'
import PrecisionMatchModal from './components/PrecisionMatchModal.vue'
import {
  type Influencer,
  type Post,
  type Project,
  type RejectionRecord,
  CITIES,
  CONTENT_TYPES,
  TAG_TREE,
} from './types'
import { CONTENT } from './content'

// ---- Page routing ----
type Page = 'radar' | 'results' | 'display' | 'projects'

const currentPage = ref<Page>('radar')
const prevPage = ref<Page>('radar')

function navigateTo(page: Page) {
  prevPage.value = currentPage.value
  currentPage.value = page
}

// ---- Search state ----
const searchQuery = ref('')
const isSearching = ref(false)
const showFilters = ref(false)
const hasSearched = ref(false)
const isAnalyzingSearch = ref(false)
const isVoiceInputActive = ref(false)
const isAnalyzingVoice = ref(false)
const radarSearchQuery = ref('')

// ---- Filter state ----
const filters = ref({
  tags: [
    TAG_TREE[0].children?.[0]?.name || '',
    TAG_TREE[1].children?.[0]?.children?.[0]?.name || '',
  ],
  price: CONTENT.common.unlimited,
  followers: CONTENT.common.unlimited,
  region: [CITIES.hot[0]],
  type: [CONTENT_TYPES[1]],
})

// ---- Projects & Rejections ----
const projects = ref<Project[]>([
  {
    id: 'p1',
    name: CONTENT.project.defaultProjectName,
    description: '默认创建的项目',
    influencers: [],
    createdAt: new Date().toISOString(),
  },
])
const selectedProjectId = ref<string | null>(null)
const rejections = ref<RejectionRecord[]>([])

// ---- Influencer / Post selection ----
const selectedInfluencer = ref<Influencer | null>(null)
const precisionMatchInfluencer = ref<Influencer | null>(null)
const selectedPost = ref<{
  influencer: Influencer
  post: Post
  matchReason?: string
} | null>(null)

// ---- Radar scanning ----
const isRadarScanning = ref(false)

// ---- Match state ----
const matchedIds = ref<string[]>([])
const standardizedConditions = ref<string[]>([])

// ---- Modal state ----
const isProjectModalOpen = ref(false)
const isRejectionModalOpen = ref(false)
const isCityModalOpen = ref(false)
const isTagModalOpen = ref(false)
const isPrecisionModalOpen = ref(false)
const pendingInfluencers = ref<Influencer[]>([])

// ---- Computed ----
const totalInfluencersCount = computed(() =>
  projects.value.reduce((sum, p) => sum + p.influencers.length, 0)
)

const skipLoading = computed(
  () => prevPage.value === 'display' || prevPage.value === 'projects'
)

// ---- Watchers ----
watch(currentPage, (page) => {
  if (page === 'display') {
    radarSearchQuery.value = ''
  }
})

// ---- Handlers ----
function handleSearch() {
  if (!searchQuery.value.trim()) return
  isAnalyzingSearch.value = true
  setTimeout(() => {
    isAnalyzingSearch.value = false
    isSearching.value = true
    showFilters.value = true
    hasSearched.value = true
  }, 2000)
}

function handleApprove(infs: Influencer[]) {
  pendingInfluencers.value = infs
  isProjectModalOpen.value = true
}

function handleReject(infs: Influencer[]) {
  pendingInfluencers.value = infs
  isRejectionModalOpen.value = true
}

function handleRemoveFromProject(infId: string) {
  projects.value = projects.value.map((p) => ({
    ...p,
    influencers: p.influencers.filter((inf) => inf.id !== infId),
  }))
}

function handleRemoveFromRejections(infId: string) {
  rejections.value = rejections.value.filter((r) => r.influencerId !== infId)
}

function addToProject(projectId: string) {
  projects.value = projects.value.map((p) => {
    if (p.id === projectId) {
      const newInfs = pendingInfluencers.value.filter(
        (inf) => !p.influencers.find((existing) => existing.id === inf.id)
      )
      return { ...p, influencers: [...p.influencers, ...newInfs] }
    }
    return p
  })
  isProjectModalOpen.value = false
  pendingInfluencers.value = []
}

function addRejection(reason: string) {
  const newRejections = pendingInfluencers.value.map((inf) => ({
    influencerId: inf.id,
    reason,
    timestamp: new Date().toISOString(),
  }))
  rejections.value = [...rejections.value, ...newRejections]
  isRejectionModalOpen.value = false
  pendingInfluencers.value = []
}

function createProject(name: string, description: string) {
  const newProject: Project = {
    id: `p-${Date.now()}`,
    name,
    description,
    influencers: [],
    createdAt: new Date().toISOString(),
  }
  projects.value = [...projects.value, newProject]
  return newProject.id
}

function deleteProject(projectId: string) {
  projects.value = projects.value.filter((p) => p.id !== projectId)
  if (selectedProjectId.value === projectId) {
    selectedProjectId.value = null
  }
}

function startRadarSearch() {
  isRadarScanning.value = true
  currentPage.value = 'display'
  setTimeout(() => {
    isRadarScanning.value = false
  }, 21000)
}

function resetSearch() {
  searchQuery.value = ''
  isSearching.value = false
  showFilters.value = false
  hasSearched.value = false
}

// ---- Modal helpers for single-influencer approve/reject from detail modals ----
function handleSingleApprove(inf: Influencer) {
  handleApprove([inf])
}

function handleSingleReject(inf: Influencer) {
  handleReject([inf])
}

// ---- Post selection helper that wraps into the selectedPost shape ----
function handleSelectPost(influencer: Influencer, post: Post, matchReason?: string) {
  selectedPost.value = { influencer, post, matchReason }
}

// ---- ProjectSelectionModal create-then-add helper ----
function handleProjectModalCreate(name: string, desc: string) {
  const newId = createProject(name, desc)
  addToProject(newId)
}
</script>

<template>
  <div
    class="relative min-h-screen text-white font-sans selection:bg-tech-blue selection:text-black overflow-x-hidden"
  >
    <Background />

    <!-- Page routing with transitions -->
    <Transition name="fade" mode="out-in">
      <RadarPage
        v-if="currentPage === 'radar'"
        key="radar"
        :searchQuery="searchQuery"
        :isSearching="isSearching"
        :showFilters="showFilters"
        :filters="filters"
        :isAnalyzingSearch="isAnalyzingSearch"
        :isVoiceInputActive="isVoiceInputActive"
        :isAnalyzingVoice="isAnalyzingVoice"
        :projectCount="totalInfluencersCount"
        @update:searchQuery="searchQuery = $event"
        @update:filters="filters = $event"
        @update:isVoiceInputActive="isVoiceInputActive = $event"
        @update:isAnalyzingVoice="isAnalyzingVoice = $event"
        @search="handleSearch"
        @startSearch="navigateTo('results')"
        @openTagModal="isTagModalOpen = true"
        @openCityModal="isCityModalOpen = true"
        @openProjects="navigateTo('projects')"
        @resetSearch="resetSearch"
      />

      <ResultsPage
        v-else-if="currentPage === 'results'"
        key="results"
        :filters="filters"
        :projectCount="totalInfluencersCount"
        :projects="projects"
        :rejections="rejections"
        :skipLoading="skipLoading"
        :matchedIds="matchedIds"
        :standardizedConditions="standardizedConditions"
        @back="navigateTo('radar')"
        @openProjects="navigateTo('projects')"
        @selectInfluencer="selectedInfluencer = $event"
        @selectPrecisionInfluencer="precisionMatchInfluencer = $event"
        @selectPost="handleSelectPost"
        @startRadar="startRadarSearch"
        @approve="handleApprove"
        @reject="handleReject"
        @removeFromProject="handleRemoveFromProject"
        @removeFromRejections="handleRemoveFromRejections"
        @openTagModal="isTagModalOpen = true"
        @openCityModal="isCityModalOpen = true"
        @update:filters="filters = $event"
        @update:matchedIds="matchedIds = $event"
        @update:standardizedConditions="standardizedConditions = $event"
      />

      <DisplayPage
        v-else-if="currentPage === 'display'"
        key="display"
        :isRadarScanning="isRadarScanning"
        :projectCount="totalInfluencersCount"
        :searchQuery="radarSearchQuery"
        :isVoiceInputActive="isVoiceInputActive"
        :isAnalyzingVoice="isAnalyzingVoice"
        @back="navigateTo('results')"
        @openProjects="navigateTo('projects')"
        @selectInfluencer="selectedInfluencer = $event"
        @selectPost="handleSelectPost"
        @startRadar="startRadarSearch"
        @approve="handleApprove"
        @reject="handleReject"
        @update:searchQuery="radarSearchQuery = $event"
        @update:isVoiceInputActive="isVoiceInputActive = $event"
        @update:isAnalyzingVoice="isAnalyzingVoice = $event"
      />

      <ProjectsPage
        v-else-if="currentPage === 'projects'"
        key="projects"
        :projects="projects"
        :selectedProjectId="selectedProjectId"
        @back="navigateTo(prevPage)"
        @createProject="createProject"
        @deleteProject="deleteProject"
        @selectInfluencer="selectedInfluencer = $event"
        @selectPost="handleSelectPost"
        @removeFromProject="handleRemoveFromProject"
        @update:selectedProjectId="selectedProjectId = $event"
      />
    </Transition>

    <!-- Modals -->
    <Transition name="fade">
      <InfluencerDetailModal
        v-if="selectedInfluencer"
        :influencer="selectedInfluencer"
        :projects="projects"
        :rejections="rejections"
        @close="selectedInfluencer = null"
        @selectPost="handleSelectPost(selectedInfluencer!, $event)"
        @approve="handleSingleApprove"
        @reject="handleSingleReject"
        @removeFromProject="handleRemoveFromProject"
        @removeFromRejections="handleRemoveFromRejections"
      />
    </Transition>

    <Transition name="fade">
      <PrecisionMatchModal
        v-if="precisionMatchInfluencer"
        :influencer="precisionMatchInfluencer"
        :standardizedConditions="standardizedConditions"
        @close="precisionMatchInfluencer = null"
        @selectPost="handleSelectPost(precisionMatchInfluencer!, $event)"
        @approve="handleSingleApprove"
        @reject="handleSingleReject"
      />
    </Transition>

    <Transition name="fade">
      <PostDetailModal
        v-if="selectedPost"
        :influencer="selectedPost.influencer"
        :post="selectedPost.post"
        :showAI="currentPage === 'display'"
        :matchReason="selectedPost.matchReason"
        @close="selectedPost = null"
      />
    </Transition>

    <Transition name="fade">
      <TagSelectionModal
        v-if="isTagModalOpen"
        :selectedTags="filters.tags"
        @close="isTagModalOpen = false"
        @confirm="(tags: string[]) => { filters.tags = tags; isTagModalOpen = false }"
      />
    </Transition>

    <Transition name="fade">
      <CitySelectionModal
        v-if="isCityModalOpen"
        :selectedCities="filters.region"
        @close="isCityModalOpen = false"
        @confirm="(cities: string[]) => { filters.region = cities; isCityModalOpen = false }"
      />
    </Transition>

    <Transition name="fade">
      <ProjectSelectionModal
        v-if="isProjectModalOpen"
        :projects="projects"
        @close="isProjectModalOpen = false; pendingInfluencers = []"
        @confirm="addToProject"
        @createProject="handleProjectModalCreate"
      />
    </Transition>

    <Transition name="fade">
      <RejectionReasonModal
        v-if="isRejectionModalOpen"
        @close="isRejectionModalOpen = false; pendingInfluencers = []"
        @confirm="addRejection"
      />
    </Transition>
  </div>
</template>
