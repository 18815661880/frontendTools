<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { findToolBySlug } from '../tools/toolsConfig'

const route = useRoute()
const tool = computed(() => findToolBySlug(route.params.slug))
</script>

<template>
  <section>
    <RouterLink to="/" class="back-link">← 返回首页</RouterLink>

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
