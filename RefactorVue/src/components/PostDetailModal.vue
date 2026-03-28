<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, ChevronLeft, X, FileText, Sparkles } from 'lucide-vue-next';
import { Influencer, Post } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{
  influencer: Influencer;
  post: Post;
  showAI?: boolean;
  matchReason?: string;
}>();
const emit = defineEmits<{ close: [] }>();

const currentImgIdx = ref(0);
const nextImg = () => { currentImgIdx.value = (currentImgIdx.value + 1) % props.post.images.length; };
const prevImg = () => { currentImgIdx.value = (currentImgIdx.value - 1 + props.post.images.length) % props.post.images.length; };
</script>

<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-2xl" @click="emit('close')" />
    <div class="relative w-full max-w-6xl h-[80vh] bg-tech-dark border border-tech-blue/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,242,255,0.2)]">
      <button @click="emit('close')" class="absolute top-6 right-6 z-30 text-white/50 hover:text-white transition-colors"><X :size="32" /></button>
      <!-- Left: Slideshow -->
      <div class="w-full md:w-3/5 h-full relative bg-black/40">
        <div class="absolute inset-0 flex items-center justify-center">
          <img :src="post.images[currentImgIdx]" class="w-full h-full object-contain" referrerpolicy="no-referrer" />
        </div>
        <div v-if="showAI" v-for="(f, i) in post.features" :key="f" class="absolute px-4 py-2 bg-tech-blue/20 backdrop-blur-md border border-tech-blue/40 rounded-full text-xs text-tech-blue shadow-[0_0_15px_rgba(0,242,255,0.3)] z-10" :style="{ top: (20 + i * 15) + '%', left: i % 2 === 0 ? '10%' : '70%' }">
          <Sparkles :size="12" class="inline mr-2" /> {{ f }}
        </div>
        <div class="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
          <button @click.stop="prevImg" class="p-4 bg-black/40 rounded-full text-white hover:bg-tech-blue/40 transition-colors pointer-events-auto"><ChevronLeft :size="32" /></button>
          <button @click.stop="nextImg" class="p-4 bg-black/40 rounded-full text-white hover:bg-tech-blue/40 transition-colors pointer-events-auto"><ChevronRight :size="32" /></button>
        </div>
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          <button v-for="(_, i) in post.images" :key="i" @click="currentImgIdx = i" :class="['w-3 h-3 rounded-full transition-all', currentImgIdx === i ? 'bg-tech-blue w-10' : 'bg-white/30']" />
        </div>
      </div>
      <!-- Right -->
      <div class="w-full md:w-2/5 h-full flex flex-col bg-tech-blue/5 border-l border-tech-blue/20">
        <div class="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div class="flex items-center gap-4 mb-8">
            <img :src="influencer.avatar" class="w-12 h-12 rounded-full border-2 border-tech-blue/30" referrerpolicy="no-referrer" />
            <div>
              <div class="font-bold text-lg">{{ influencer.name }}</div>
              <div class="text-xs text-white/40">{{ CONTENT.common.publishedRecently }}</div>
            </div>
          </div>
          <div class="bg-white/5 rounded-2xl p-6 mb-8">
            <div class="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold"><FileText :size="18" /> {{ CONTENT.postDetail.content }}</div>
            <p class="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{{ post.text }}</p>
          </div>
          <div v-if="showAI" class="bg-tech-blue/10 border border-tech-blue/20 rounded-2xl p-6 mb-8">
            <div class="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold"><Sparkles :size="18" /> {{ CONTENT.postDetail.aiAnalysis }}</div>
            <p class="text-white/70 text-sm italic leading-relaxed">"{{ post.matchAnalysis }}"</p>
          </div>
          <div v-if="matchReason" class="bg-tech-blue/10 border border-tech-blue/30 rounded-2xl p-6 mb-8">
            <div class="flex items-center gap-2 text-tech-blue mb-4 text-sm font-bold"><Sparkles :size="18" /> {{ CONTENT.resultsPage.precisionSearch.matchReason }}</div>
            <p class="text-white/70 text-sm leading-relaxed">{{ matchReason }}</p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white/5 p-4 rounded-2xl text-center">
              <div class="text-xs text-white/40 mb-1">{{ CONTENT.postDetail.views }}</div>
              <div class="text-sm font-bold text-tech-blue">{{ (post.views / 10000).toFixed(1) }}W</div>
            </div>
            <div class="bg-white/5 p-4 rounded-2xl text-center">
              <div class="text-xs text-white/40 mb-1">{{ CONTENT.postDetail.comments }}</div>
              <div class="text-sm font-bold text-tech-blue">{{ post.comments }}</div>
            </div>
            <div class="bg-white/5 p-4 rounded-2xl text-center">
              <div class="text-xs text-white/40 mb-1">{{ CONTENT.postDetail.likes }}</div>
              <div class="text-sm font-bold text-tech-blue">{{ post.likes }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
