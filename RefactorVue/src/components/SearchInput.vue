<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (v) => { localValue.value = v; });

function onInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value;
  localValue.value = val;
  emit('update:modelValue', val);
}
</script>

<template>
  <textarea
    :value="localValue"
    @input="onInput"
    :placeholder="placeholder"
    class="w-full bg-transparent border-none outline-none text-lg resize-none min-h-[100px] placeholder:text-white/30"
  />
</template>
