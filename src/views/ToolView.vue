<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findToolBySlug } from '../tools/toolsConfig'

const route = useRoute()
const tool = computed(() => findToolBySlug(route.params.slug))
</script>

<template>
  <section class="tool-view">
    <RouterLink to="/" class="back-link">
      <span class="back-link-icon">←</span>
      <span class="back-link-text">返回首页</span>
    </RouterLink>

    <template v-if="tool">
      <h1 class="page-title">{{ tool.name }}</h1>
      <p class="page-subtitle">{{ tool.description }}</p>
      <div class="tool-panel">
        <component :is="tool.component" />
      </div>
    </template>

    <template v-else>
      <h1 class="page-title">工具不存在</h1>
      <p class="page-subtitle">请返回首页重新选择。</p>
    </template>
  </section>
</template>

<style scoped>
.tool-view {
  position: relative;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  transition: color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.back-link:hover {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: #93c5fd;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
}

.back-link-icon {
  font-size: 16px;
  line-height: 1;
  opacity: 0.9;
}

.back-link-text {
  letter-spacing: 0.02em;
}
</style>
