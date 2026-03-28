<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, X, Tag } from 'lucide-vue-next';
import { TAG_TREE, TagNode } from '../types';
import { CONTENT } from '../content';

const props = defineProps<{ selectedTags: string[] }>();
const emit = defineEmits<{ close: []; confirm: [tags: string[]] }>();

const tempTags = ref<string[]>([...props.selectedTags]);
const expandedNodes = ref<string[]>(['1', '2', '3']);

function toggleNode(id: string) {
  const idx = expandedNodes.value.indexOf(id);
  if (idx >= 0) expandedNodes.value.splice(idx, 1);
  else expandedNodes.value.push(id);
}

function toggleTag(name: string) {
  const idx = tempTags.value.indexOf(name);
  if (idx >= 0) tempTags.value.splice(idx, 1);
  else tempTags.value.push(name);
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="bg-tech-dark border border-tech-blue/30 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.1)]">
      <div class="p-6 border-b border-white/10 flex justify-between items-center bg-tech-blue/5">
        <h3 class="text-xl font-bold text-tech-blue flex items-center gap-2">
          <Tag :size="20" /> {{ CONTENT.radarPage.filters.moreTags }}
        </h3>
        <button @click="emit('close')" class="p-2 hover:bg-white/10 rounded-full transition-colors"><X :size="20" /></button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        <div class="grid grid-cols-1 gap-2">
          <template v-for="node in TAG_TREE" :key="node.id">
            <div class="select-none">
              <div class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors bg-white/5 mb-1" @click="node.children?.length ? toggleNode(node.id) : toggleTag(node.name)">
                <ChevronRight v-if="node.children?.length" :size="16" :class="['text-tech-blue transition-transform', expandedNodes.includes(node.id) ? 'rotate-90' : '']" />
                <span :class="[node.children?.length ? 'text-sm font-bold' : 'text-sm', tempTags.includes(node.name) ? 'text-tech-blue font-bold' : 'text-white/80']">{{ node.name }}</span>
              </div>
              <template v-if="node.children?.length && expandedNodes.includes(node.id)">
                <div class="mt-1" v-for="child in node.children" :key="child.id">
                  <div class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5" style="padding-left: 32px" @click="child.children?.length ? toggleNode(child.id) : toggleTag(child.name)">
                    <ChevronRight v-if="child.children?.length" :size="16" :class="['text-tech-blue transition-transform', expandedNodes.includes(child.id) ? 'rotate-90' : '']" />
                    <div v-else :class="['w-4 h-4 rounded border flex items-center justify-center transition-colors', tempTags.includes(child.name) ? 'bg-tech-blue border-tech-blue' : 'border-white/20']">
                      <X v-if="tempTags.includes(child.name)" :size="10" class="text-black" />
                    </div>
                    <span :class="[child.children?.length ? 'text-sm font-bold' : 'text-sm', tempTags.includes(child.name) ? 'text-tech-blue font-bold' : 'text-white/80']">{{ child.name }}</span>
                  </div>
                  <template v-if="child.children?.length && expandedNodes.includes(child.id)">
                    <div v-for="leaf in child.children" :key="leaf.id" class="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5" style="padding-left: 52px" @click="toggleTag(leaf.name)">
                      <div :class="['w-4 h-4 rounded border flex items-center justify-center transition-colors', tempTags.includes(leaf.name) ? 'bg-tech-blue border-tech-blue' : 'border-white/20']">
                        <X v-if="tempTags.includes(leaf.name)" :size="10" class="text-black" />
                      </div>
                      <span :class="['text-sm', tempTags.includes(leaf.name) ? 'text-tech-blue font-bold' : 'text-white/80']">{{ leaf.name }}</span>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="p-6 border-t border-white/10 bg-tech-blue/5 flex justify-between items-center">
        <div class="text-xs text-white/40">{{ CONTENT.common.selected }} <span class="text-tech-blue font-bold">{{ tempTags.length }}</span> {{ CONTENT.common.tagsUnit }}</div>
        <div class="flex gap-4">
          <button @click="emit('close')" class="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">{{ CONTENT.common.cancel }}</button>
          <button @click="emit('confirm', tempTags)" class="px-8 py-2 rounded-xl bg-tech-blue text-black font-bold hover:scale-105 transition-transform">{{ CONTENT.common.confirm }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
