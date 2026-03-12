<script setup>
import { ref } from 'vue'

const inputText = ref('<div class="box">hello</div>')
const outputText = ref('')
const copyToast = ref('')

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => escapeMap[c])
}

function unescapeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function doEscape() {
  outputText.value = escapeHtml(inputText.value)
}

function doUnescape() {
  outputText.value = unescapeHtml(inputText.value)
}

async function copyResult() {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    copyToast.value = '已复制'
    setTimeout(() => { copyToast.value = '' }, 1500)
  } catch {
    copyToast.value = '复制失败'
    setTimeout(() => { copyToast.value = '' }, 1500)
  }
}
</script>

<template>
  <div class="tool-content">
    <label class="field-label">输入 HTML 或已转义文本</label>
    <textarea v-model="inputText" rows="5" class="text-area" placeholder="例如：<script> 或 &lt;div&gt;" />
    <div class="button-row">
      <button @click="doEscape">转义 → &amp; &lt; &gt;</button>
      <button @click="doUnescape">反转义</button>
      <button @click="copyResult">复制结果</button>
    </div>
    <label class="field-label">输出结果</label>
    <textarea :value="outputText" rows="5" class="text-area" readonly />
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 8px 16px;
  background: #1f2937;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  z-index: 100;
}
</style>
