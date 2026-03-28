<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { Project } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{ projects: Project[] }>();
const emit = defineEmits<{
  close: [];
  confirm: [projectId: string];
  createProject: [name: string, desc: string];
}>();

const selectedId = ref(props.projects[0]?.id || '');
const isCreating = ref(false);
const newName = ref('');
const newDesc = ref('');

function handleConfirm() {
  if (isCreating.value) {
    if (!newName.value.trim()) return;
    emit('createProject', newName.value, newDesc.value);
  } else {
    emit('confirm', selectedId.value);
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="emit('close')" />
    <div class="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
      <h2 class="text-2xl font-bold text-tech-blue mb-6">{{ CONTENT.project.addToProject }}</h2>
      <div class="space-y-6">
        <template v-if="!isCreating">
          <div>
            <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{{ CONTENT.project.selectProject }}</label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <button
                v-for="p in projects" :key="p.id"
                @click="selectedId = p.id"
                :class="['w-full text-left p-4 rounded-xl border transition-all', selectedId === p.id ? 'bg-tech-blue/10 border-tech-blue text-tech-blue' : 'bg-white/5 border-white/10 text-white/60 hover:border-tech-blue/30']"
              ><div class="font-bold">{{ p.name }}</div></button>
            </div>
          </div>
          <button @click="isCreating = true" class="w-full py-3 border border-dashed border-tech-blue/30 text-tech-blue rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-tech-blue/5 transition-colors">
            <Plus :size="16" /> {{ CONTENT.project.newProject }}
          </button>
        </template>
        <template v-else>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{{ CONTENT.project.projectName }}</label>
              <input type="text" v-model="newName" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors" :placeholder="CONTENT.project.projectNamePlaceholder" />
            </div>
            <div>
              <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{{ CONTENT.project.projectDesc }}</label>
              <textarea v-model="newDesc" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-tech-blue/50 outline-none transition-colors resize-none h-24" :placeholder="CONTENT.project.projectDescPlaceholder" />
            </div>
            <button @click="isCreating = false" class="text-tech-blue text-xs hover:underline">{{ CONTENT.project.backToSelect }}</button>
          </div>
        </template>
        <div class="flex gap-4 pt-4">
          <button @click="emit('close')" class="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors">{{ CONTENT.common.cancel }}</button>
          <button @click="handleConfirm" class="flex-1 py-3 bg-tech-blue text-black rounded-xl font-bold hover:scale-105 transition-transform">{{ CONTENT.common.confirm }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
