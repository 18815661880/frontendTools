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
  'rem-px': '📐',
  placeholder: '📄',
  hash: '🔒',
  jwt: '🎫',
  'number-base': '🔢',
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
      <div class="hero-bg" aria-hidden="true" />
      <p class="hero-kicker">Frontend Toolkit</p>
      <h1 class="hero-title">常用前端工具</h1>
      <p class="hero-subtitle">全部工具均在本地浏览器运行，打开即用，数据不上传。</p>
      <div class="hero-badges">
        <span class="hero-badge">{{ tools.length }} 个工具</span>
        <span class="hero-badge">纯前端</span>
        <span class="hero-badge">无后端依赖</span>
      </div>
    </div>

    <h2 class="section-title">选择工具</h2>
    <div class="tool-grid">
      <router-link v-for="(item, i) in tools" :key="item.slug" :to="`/tools/${item.slug}`" class="tool-card"
        :style="{ '--i': i }">
        <div class="tool-icon-wrap">
          <span class="tool-icon">{{ getIcon(item.slug) }}</span>
        </div>
        <h3 class="tool-name">{{ item.name }}</h3>
        <p class="tool-desc">{{ item.description }}</p>
        <span class="tool-enter">进入 <span class="arrow">→</span></span>
      </router-link>
    </div>

    <footer class="home-footer">
      <button type="button" class="footer-btn" @click="showContact = true">
        <span class="footer-btn-icon">✉</span> 联系我们
      </button>
      <button v-if="false" type="button" class="footer-btn" @click="showReward = true">
        <span class="footer-btn-icon">♥</span> 打赏作者
      </button>
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
        <img :src="`${baseUrl}wechat-reward.png`" alt="微信收款码" class="reward-qr"
          @error="$event.target.style.display = 'none'" />
        <button type="button" class="btn-ghost" @click="showReward = false">关闭</button>
      </div>
    </div>
  </section>
</template>


<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Hero */
.hero-card {
  position: relative;
  border-radius: 20px;
  padding: 28px 24px;
  overflow: hidden;
  background: linear-gradient(145deg, #1e3a5f 0%, #0f172a 50%, #1e293b 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
}

.hero-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%);
  pointer-events: none;
}

.hero-kicker {
  position: relative;
  margin: 0 0 6px;
  color: #7dd3fc;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
}

.hero-title {
  position: relative;
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  position: relative;
  margin: 0 0 20px;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.5;
  max-width: 480px;
}

.hero-badges {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 12px;
  padding: 6px 14px;
  font-weight: 500;
}

/* Section */
.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
}

/* Tool grid */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.tool-card {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  animation: cardIn 0.4s ease backwards;
  animation-delay: calc(var(--i, 0) * 0.03s);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: #93c5fd;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.15);
}

.tool-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(180deg, #3b82f6, #60a5fa);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-icon {
  font-size: 22px;
}

.tool-name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
}

.tool-desc {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
  min-height: 38px;
}

.tool-enter {
  margin-top: auto;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tool-enter .arrow {
  transition: transform 0.2s ease;
}

.tool-card:hover .arrow {
  transform: translateX(3px);
}

/* Footer */
.home-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.footer-btn:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
  color: #334155;
}

.footer-btn-icon {
  font-size: 16px;
  opacity: 0.9;
}

/* Modals */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-box {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  animation: modalIn 0.25s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-8px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-box--reward {
  text-align: center;
}

.modal-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.modal-row {
  margin: 0 0 18px;
  font-size: 15px;
  color: #475569;
}

.modal-hint {
  margin: 0 0 14px;
  color: #64748b;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-toast {
  margin: 12px 0 0;
  color: #16a34a;
  font-size: 13px;
}

.reward-qr {
  max-width: 260px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-ghost {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-ghost:hover {
  background: #e2e8f0;
  color: #334155;
}
</style>