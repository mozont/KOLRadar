<script setup lang="ts">
const colors = [
  'rgba(0, 242, 255, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(59, 130, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(34, 211, 238, 0.8)',
];

const particles = Array.from({ length: 75 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 2,
  duration: Math.random() * 10 + 5,
  tx: Math.random() * 120 - 60,
  ty: Math.random() * 120 - 60,
  delay: Math.random() * -20,
  color: colors[Math.floor(Math.random() * colors.length)],
}));
</script>

<template>
  <div class="glow-bg overflow-hidden">
    <div class="absolute inset-0 opacity-40 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-tech-blue/20 blur-[100px] animate-pulse" />
      <div class="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-500/10 blur-[120px] animate-pulse" style="animation-delay: -2s" />
    </div>
    <div class="halo opacity-50" style="width: 800px; height: 800px; top: -200px; left: -200px; animation-duration: 15s" />
    <div class="halo opacity-40" style="width: 1000px; height: 1000px; bottom: -300px; right: -300px; animation-delay: -5s; animation-duration: 20s" />
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        width: p.size + 'px',
        height: p.size + 'px',
        backgroundColor: p.color,
        animation: `float ${p.duration}s infinite ease-in-out`,
        animationDelay: p.delay + 's',
        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
        '--tx': p.tx + 'px',
        '--ty': p.ty + 'px'
      }"
    />
  </div>
</template>
