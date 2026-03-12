<script setup>
import { ref } from 'vue'
import { tools } from '../tools/toolsConfig'

const iconMap = {
  json: '🧩',
  color: '🎨',
  date: '🕒',
  image: '🖼️',
  variable: '📝',
  base64: '🔐',
  url: '🔗',
  'html-escape': '📄',
  regex: '📋',
  uuid: '🆔',
  'code-preview': '👁️',
}

const showContact = ref(false)
const showReward = ref(false)
const contactToast = ref('')
const wechatId = 'fgfffh66668'
const baseUrl = import.meta.env.BASE_URL

function getIcon(slug) {
  return iconMap[slug] || '🛠️'
}

async function copyWechatId() {
  try {
    await navigator.clipboard.writeText(wechatId)
    contactToast.value = '已复制微信号'
    setTimeout(() => { contactToast.value = '' }, 1500)
  } catch {
    contactToast.value = '复制失败'
    setTimeout(() => { contactToast.value = '' }, 1500)
  }
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

    <footer class="home-footer">
      <button type="button" class="footer-btn" @click="showContact = true">联系我们</button>
      <button type="button" class="footer-btn" @click="showReward = true">打赏作者</button>
    </footer>

    <div v-if="showContact" class="modal-mask" @click.self="showContact = false">
      <div class="modal-box">
        <h3 class="modal-title">联系我们</h3>
        <p class="modal-row">微信号：<strong>{{ wechatId }}</strong></p>
        <div class="modal-actions">
          <button type="button" @click="copyWechatId">复制微信号</button>
          <button type="button" class="btn-ghost" @click="showContact = false">关闭</button>
        </div>
        <p v-if="contactToast" class="modal-toast">{{ contactToast }}</p>
      </div>
    </div>

    <div v-if="showReward" class="modal-mask" @click.self="showReward = false">
      <div class="modal-box modal-box--reward">
        <h3 class="modal-title">打赏作者</h3>
        <p class="modal-hint">推荐使用微信支付</p>
        <img :src="`${baseUrl}wechat-reward.png`" alt="微信收款码" class="reward-qr" @error="$event.target.style.display='none'" />
        <button type="button" class="btn-ghost" @click="showReward = false">关闭</button>
      </div>
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

.home-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.footer-btn {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
}

.footer-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  max-width: 90vw;
}

.modal-box--reward {
  text-align: center;
}

.modal-title {
  margin: 0 0 12px;
  font-size: 18px;
}

.modal-row {
  margin: 0 0 16px;
  font-size: 15px;
}

.modal-hint {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-toast {
  margin: 10px 0 0;
  color: #16a34a;
  font-size: 13px;
}

.reward-qr {
  max-width: 260px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 16px;
  border-radius: 8px;
}

.btn-ghost {
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-ghost:hover {
  background: #f1f5f9;
  color: #475569;
}
</style>