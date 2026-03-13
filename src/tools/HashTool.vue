<script setup>
import { ref } from 'vue'

const inputText = ref('')
const algo = ref('SHA-256')
const hashResult = ref('')
const errorText = ref('')
const copyToast = ref('')

async function computeHash() {
  errorText.value = ''
  hashResult.value = ''
  const text = inputText.value
  if (!text.trim()) return
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const buffer = await crypto.subtle.digest(algo.value, data)
    const arr = Array.from(new Uint8Array(buffer))
    hashResult.value = arr.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch (e) {
    errorText.value = '计算失败：' + (e.message || String(e))
  }
}

async function copyResult() {
  if (!hashResult.value) return
  try {
    await navigator.clipboard.writeText(hashResult.value)
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
    <label class="field-label">输入文本</label>
    <textarea v-model="inputText" rows="4" class="text-area" placeholder="输入要计算哈希的字符串" />
    <div class="input-row">
      <label class="field-label">算法</label>
      <select v-model="algo" class="text-input select-input">
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-384">SHA-384</option>
        <option value="SHA-512">SHA-512</option>
      </select>
      <button @click="computeHash">计算哈希</button>
    </div>
    <p v-if="errorText" class="error-text">{{ errorText }}</p>
    <label v-if="hashResult" class="field-label">哈希结果 (hex)</label>
    <div v-if="hashResult" class="result-row">
      <code class="hash-value">{{ hashResult }}</code>
      <button @click="copyResult">复制</button>
    </div>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-input {
  width: 140px;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.hash-value {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
  word-break: break-all;
}

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
