<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  ChevronRight, ArrowLeft, Plus, X,
  Users, Layers, MessageSquare
} from 'lucide-vue-next';
import type { Influencer, Project } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{
  projects: Project[];
  selectedProjectId: string | null;
}>();

const emit = defineEmits<{
  'back': [];
  'createProject': [name: string, description: string];
  'deleteProject': [id: string];
  'selectInfluencer': [influencer: Influencer];
  'selectPost': [influencer: Influencer, post: any];
  'removeFromProject': [influencerId: string];
  'update:selectedProjectId': [id: string | null];
}>();

const isCreating = ref(false);
const newName = ref('');
const newDesc = ref('');

// Auto-select first project when none is selected
watch(
  () => [props.projects, props.selectedProjectId] as const,
  ([projects, selectedId]) => {
    if (!selectedId && projects.length > 0) {
      emit('update:selectedProjectId', projects[0].id);
    }
  },
  { immediate: true }
);

const selectedProject = computed(() =>
  props.projects.find((p) => p.id === props.selectedProjectId) ?? null
);

function handleCreate() {
  if (!newName.value.trim()) return;
  emit('createProject', newName.value, newDesc.value);
  // After creating, the parent should add the project and we select it
  // We rely on the parent to handle selection via the createProject event
  isCreating.value = false;
  newName.value = '';
  newDesc.value = '';
}

function handleDeleteProject(e: Event, id: string) {
  e.stopPropagation();
  emit('deleteProject', id);
}

function handleBatchContact() {
  if (selectedProject.value) {
    alert(CONTENT.project.batchContact + ': ' + selectedProject.value.influencers.length + ' ' + CONTENT.resultsPage.unit);
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-10 min-h-screen flex flex-col projects-page-enter">
    <!-- Header -->
    <header class="flex justify-between items-center mb-12">
      <div class="flex items-center gap-6">
        <button
          @click="emit('back')"
          class="p-3 bg-tech-dark/60 border border-tech-blue/30 rounded-full hover:bg-tech-blue/20 transition-colors text-tech-blue"
        >
          <ArrowLeft :size="24" />
        </button>
        <h1 class="text-3xl font-bold tracking-widest text-tech-blue">
          {{ CONTENT.project.projectTitle }}
        </h1>
      </div>
      <button
        @click="isCreating = true"
        class="px-6 py-3 bg-tech-blue text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <Plus :size="20" />
        {{ CONTENT.project.newProject }}
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
      <!-- Project List -->
      <div class="lg:col-span-1 space-y-4">
        <h2 class="text-sm font-bold text-white/40 uppercase tracking-widest px-4">
          {{ CONTENT.project.projectList }}
        </h2>
        <div class="space-y-2">
          <button
            v-for="p in projects"
            :key="p.id"
            @click="emit('update:selectedProjectId', p.id)"
            :class="[
              'w-full text-left p-4 rounded-2xl border transition-all group relative',
              selectedProjectId === p.id
                ? 'bg-tech-blue/10 border-tech-blue text-tech-blue'
                : 'bg-tech-dark/40 border-white/10 text-white/60 hover:border-tech-blue/30'
            ]"
          >
            <div class="font-bold truncate pr-8">{{ p.name }}</div>
            <div class="text-xs opacity-60 mt-1">
              {{ p.influencers.length }} {{ CONTENT.resultsPage.unit }}
            </div>
            <button
              @click="handleDeleteProject($event, p.id)"
              class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
            >
              <X :size="16" />
            </button>
          </button>
        </div>
      </div>

      <!-- Influencer List -->
      <div class="lg:col-span-3 bg-tech-dark/40 border border-tech-blue/20 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
        <template v-if="selectedProject">
          <!-- Project Header -->
          <div class="p-8 border-b border-tech-blue/10 bg-tech-blue/5">
            <h2 class="text-2xl font-bold text-tech-blue">{{ selectedProject.name }}</h2>
            <p class="text-white/60 mt-2 text-sm">{{ selectedProject.description }}</p>
          </div>

          <!-- Influencer Cards -->
          <div class="flex-1 overflow-y-auto p-6">
            <div
              v-if="selectedProject.influencers.length === 0"
              class="h-full flex flex-col items-center justify-center text-white/20 gap-4"
            >
              <Users :size="64" :stroke-width="1" />
              <p>{{ CONTENT.project.noInfluencers }}</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="inf in selectedProject.influencers"
                :key="inf.id"
                class="bg-tech-dark/60 border border-tech-blue/20 rounded-2xl p-6 flex items-center gap-4 relative group"
              >
                <img
                  :src="inf.avatar"
                  class="w-16 h-16 rounded-full border-2 border-tech-blue/30"
                  referrerpolicy="no-referrer"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg truncate">{{ inf.name }}</h3>
                  <div class="flex gap-3 text-xs text-white/40 mt-1">
                    <span>{{ inf.region }}</span>
                    <span>{{ (inf.followers / 10000).toFixed(1) }}W</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="emit('selectInfluencer', inf)"
                    class="p-2 text-white/20 hover:text-tech-blue transition-colors"
                  >
                    <ChevronRight :size="20" />
                  </button>
                  <button
                    @click="emit('removeFromProject', inf.id)"
                    class="p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <X :size="20" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Batch Contact Footer -->
          <div
            v-if="selectedProject.influencers.length > 0"
            class="p-6 border-t border-tech-blue/10 bg-tech-blue/5 flex justify-end"
          >
            <button
              @click="handleBatchContact"
              class="px-8 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <MessageSquare :size="20" />
              {{ CONTENT.project.batchContact }}
            </button>
          </div>
        </template>

        <!-- No Project Selected -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-white/20 gap-4"
        >
          <Layers :size="64" :stroke-width="1" />
          <p>{{ CONTENT.project.selectProjectHint }}</p>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <Transition name="modal">
      <div
        v-if="isCreating"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          @click="isCreating = false"
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <div class="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
          <h2 class="text-2xl font-bold text-tech-blue mb-6">
            {{ CONTENT.project.newProject }}
          </h2>
          <div class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                {{ CONTENT.project.projectName }}
              </label>
              <input
                type="text"
                v-model="newName"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors"
                :placeholder="CONTENT.project.projectNamePlaceholder"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                {{ CONTENT.project.projectDesc }}
              </label>
              <textarea
                v-model="newDesc"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors resize-none h-32"
                :placeholder="CONTENT.project.projectDescPlaceholder"
              />
            </div>
            <div class="flex gap-4 pt-4">
              <button
                @click="isCreating = false"
                class="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
              >
                {{ CONTENT.common.cancel }}
              </button>
              <button
                @click="handleCreate"
                class="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform"
              >
                {{ CONTENT.common.confirm }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.projects-page-enter {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
