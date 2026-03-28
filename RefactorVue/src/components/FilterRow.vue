<script setup lang="ts">
import { CONTENT } from '../content';

defineProps<{
  label: string;
  options: string[];
  modelValue: string | string[];
  isMulti?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]];
}>();

function handleClick(opt: string, value: string | string[], isMulti?: boolean) {
  if (isMulti && Array.isArray(value)) {
    const isSelected = value.includes(opt);
    const next = isSelected ? value.filter(v => v !== opt) : [...value, opt];
    emit('update:modelValue', next.length ? next : [opt]);
  } else {
    emit('update:modelValue', opt);
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-sm text-white/50">{{ label }} {{ isMulti ? CONTENT.common.multiSelect : '' }}</span>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="opt in options"
        :key="opt"
        @click="handleClick(opt, modelValue, isMulti)"
        :class="[
          'px-3 py-1 rounded-lg text-sm border transition-all',
          (isMulti ? (modelValue as string[]).includes(opt) : modelValue === opt)
            ? 'bg-tech-blue text-black border-tech-blue'
            : 'border-white/10 hover:border-tech-blue/50'
        ]"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
