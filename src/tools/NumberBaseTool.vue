<script setup>
import { ref, computed } from 'vue'

const inputValue = ref('')
const fromBase = ref(10)

const bases = [
  { value: 2, label: '二进制' },
  { value: 8, label: '八进制' },
  { value: 10, label: '十进制' },
  { value: 16, label: '十六进制' },
]

function parseWithBase(str, base) {
  const s = String(str).trim()
  if (!s) return null
  if (base === 16 && /^[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16)
  if (base === 10 && /^-?[0-9]+$/.test(s)) return parseInt(s, 10)
  if (base === 8 && /^[0-7]+$/.test(s)) return parseInt(s, 8)
  if (base === 2 && /^[01]+$/.test(s)) return parseInt(s, 2)
  const n = parseInt(s, base)
  return Number.isNaN(n) ? null : n
}

const results = computed(() => {
  const num = parseWithBase(inputValue.value, fromBase.value)
  if (num === null) return []
  return bases.map((b) => ({
    ...b,
    value: b.value === 10 ? String(num) : num.toString(b.value).toUpperCase(),
  }))
})

const copyToast = ref('')

async function copyText(text) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
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
    <label class="field-label">输入数值</label>
    <div class="input-row">
      <input v-model="inputValue" type="text" class="text-input" placeholder="输入数字" />
      <span class="label-inline">按</span>
      <select v-model="fromBase" class="text-input select-input">
        <option v-for="b in bases" :key="b.value" :value="b.value">{{ b.label }} ({{ b.value }})</option>
      </select>
      <span class="label-inline">解析</span>
    </div>

    <label v-if="results.length" class="field-label">换算结果</label>
    <ul v-if="results.length" class="result-list">
      <li v-for="item in results" :key="item.value" class="result-item">
        <span class="result-label">{{ item.label }}</span>
        <code class="result-value">{{ item.value }}</code>
        <button type="button" class="btn-copy" @click="copyText(item.value)">复制</button>
      </li>
    </ul>
    <p v-else-if="inputValue.trim()" class="hint">请输入合法数字（当前进制）。</p>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label-inline {
  font-size: 14px;
  color: #6b7280;
}

.select-input {
  width: 140px;
}

.result-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.result-label {
  min-width: 80px;
  font-size: 13px;
  color: #6b7280;
}

.result-value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  padding: 4px 8px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.btn-copy {
  padding: 4px 10px;
  font-size: 13px;
}

.hint {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
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
