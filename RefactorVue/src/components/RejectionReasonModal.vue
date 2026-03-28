<script setup lang="ts">
import { ref } from 'vue';
import { CONTENT } from '../content';

const emit = defineEmits<{
  close: [];
  confirm: [reason: string];
}>();

const reason = ref('');
</script>

<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <Transition name="fade">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="emit('close')" />
    </Transition>
    <div class="relative w-full max-w-md bg-tech-dark border border-tech-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
      <h2 class="text-2xl font-bold text-red-400 mb-6">{{ CONTENT.project.reject }}</h2>
      <div class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{{ CONTENT.project.rejectReason }}</label>
          <textarea
            v-model="reason"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400/50 outline-none transition-colors resize-none h-32"
            :placeholder="CONTENT.project.rejectReasonPlaceholder"
          />
        </div>
        <div class="flex gap-4 pt-4">
          <button @click="emit('close')" class="flex-1 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors">
            {{ CONTENT.common.cancel }}
          </button>
          <button
            @click="emit('confirm', reason)"
            :disabled="!reason.trim()"
            class="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {{ CONTENT.common.submit }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
