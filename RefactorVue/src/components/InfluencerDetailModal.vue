<script setup lang="ts">
import { computed } from 'vue';
import { Heart, Plus, X, MapPin, Users, Tag, FileText, TrendingUp } from 'lucide-vue-next';
import { Influencer, Post, Project, RejectionRecord } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{
  influencer: Influencer;
  projects: Project[];
  rejections: RejectionRecord[];
}>();
const emit = defineEmits<{
  close: [];
  selectPost: [post: Post];
  approve: [inf: Influencer];
  reject: [inf: Influencer];
  removeFromProject: [id: string];
  removeFromRejections: [id: string];
}>();

const isApproved = computed(() => props.projects.some(p => p.influencers.some(inf => inf.id === props.influencer.id)));
const isRejected = computed(() => props.rejections.some(r => r.influencerId === props.influencer.id));
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" @click="emit('close')" />
    <div class="relative w-full max-w-4xl bg-tech-dark border border-tech-blue/30 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,242,255,0.15)] max-h-[90vh]">
      <button @click="emit('close')" class="absolute top-6 right-6 z-30 text-white/50 hover:text-white transition-colors"><X :size="32" /></button>
      <div class="p-10 overflow-y-auto custom-scrollbar">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div class="relative">
            <img :src="influencer.avatar" class="w-32 h-32 rounded-full border-4 border-tech-blue/30 shadow-[0_0_30px_rgba(0,242,255,0.2)]" referrerpolicy="no-referrer" />
            <div v-if="isApproved" class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg whitespace-nowrap">{{ CONTENT.project.approved }}</div>
            <div v-if="isRejected" class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg whitespace-nowrap">{{ CONTENT.project.rejected }}</div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h2 class="text-4xl font-bold text-white tracking-tight">{{ influencer.name }}</h2>
              <div class="bg-tech-blue text-black text-xs font-bold px-3 py-1 rounded-full">{{ influencer.fitScore }}% {{ CONTENT.influencerDetail.fitScore }}</div>
            </div>
            <div class="flex flex-wrap justify-center md:justify-start gap-4 text-white/60 mb-6">
              <span class="flex items-center gap-2"><MapPin :size="16" /> {{ influencer.region }}</span>
              <span class="flex items-center gap-2"><Tag :size="16" /> {{ influencer.type }}</span>
              <span class="flex items-center gap-2"><Users :size="16" /> {{ (influencer.followers / 10000).toFixed(1) }}W {{ CONTENT.common.followersSuffix }}</span>
            </div>
            <p class="text-white/50 leading-relaxed max-w-2xl mx-auto md:mx-0">{{ influencer.intro }}</p>
          </div>
          <div class="flex flex-col gap-3">
            <template v-if="isApproved || isRejected">
              <button @click="isApproved ? emit('removeFromProject', influencer.id) : emit('removeFromRejections', influencer.id)" class="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all font-bold">{{ CONTENT.project.remove }}</button>
            </template>
            <template v-else>
              <button @click="emit('approve', influencer)" class="bg-tech-blue text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)]"><Plus :size="20" /> {{ CONTENT.project.approve }}</button>
              <button @click="emit('reject', influencer)" class="bg-red-500/10 border border-red-500/50 text-red-500 px-8 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"><X :size="20" /> {{ CONTENT.project.reject }}</button>
            </template>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold text-tech-blue mb-6 flex items-center gap-2"><FileText :size="20" /> {{ CONTENT.influencerDetail.recentPosts }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="post in influencer.posts" :key="post.id" @click="emit('selectPost', post)" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group">
              <div class="relative aspect-[3/4]">
                <img :src="post.images[0]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <p class="text-xs text-white/80 line-clamp-2 mb-2">{{ post.text }}</p>
                  <div class="flex justify-between items-center text-xs text-tech-blue font-bold">
                    <span class="flex items-center gap-1"><TrendingUp :size="10" /> {{ (post.views / 10000).toFixed(1) }}W</span>
                    <span class="flex items-center gap-1"><Heart :size="10" /> {{ post.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
