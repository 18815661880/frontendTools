<script setup>
import { tools } from '../tools/toolsConfig'

const iconMap = {
  json: '🧩',
  color: '🎨',
  date: '🕒',
  image: '🖼️',
}

function getIcon(slug) {
  return iconMap[slug] || '🛠️'
}
</script>

<template>
  <section class="home-page">
    <div class="hero-card">
      <p class="hero-kicker">Frontend Toolkit</p>
      <h1 class="page-title">常用前端工具</h1>
      <p class="hero-subtitle">全部工具均在本地浏览器运行，打开即用，数据不上传。</p>
      <div class="hero-badges">
        <span class="hero-badge">{{ tools.length }} 个工具</span>
        <span class="hero-badge">纯前端</span>
        <span class="hero-badge">无后端依赖</span>
      </div>
    </div>

    <div class="tool-grid">
      <router-link
        v-for="item in tools"
        :key="item.slug"
        :to="`/tools/${item.slug}`"
        class="tool-card"
      >
        <div class="tool-card-head">
          <span class="tool-icon">{{ getIcon(item.slug) }}</span>
          <span class="tool-tag">常用</span>
        </div>
        <h2 class="tool-name">{{ item.name }}</h2>
        <p class="tool-desc">{{ item.description }}</p>
        <span class="tool-enter">进入工具 →</span>
      </router-link>
    </div>
  </section>
</template>


<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card {
  border: 1px solid #dbeafe;
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #eef2ff 100%);
}

.hero-kicker {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.hero-subtitle {
  margin: 8px 0 14px;
  color: #475569;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-badge {
  border: 1px solid #bfdbfe;
  background: #ffffff;
  color: #1e40af;
  border-radius: 999px;
  font-size: 12px;
  padding: 4px 10px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}

.tool-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  text-decoration: none;
  color: inherit;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
}

.tool-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eff6ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.tool-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #0369a1;
  background: #e0f2fe;
}

.tool-name {
  margin: 0;
  font-size: 17px;
}

.tool-desc {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  min-height: 42px;
}

.tool-enter {
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
}
</style>