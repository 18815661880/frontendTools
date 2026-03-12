<script setup>
import { ref, computed } from 'vue'

const inputText = ref('用户列表')
const copyToast = ref('')

function toWords(str) {
  if (!str || !str.trim()) return []
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\s_\-]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

const results = computed(() => {
  const words = toWords(inputText.value)
  if (words.length === 0) return []

  const camel = words[0] + words.slice(1).map(capitalize).join('')
  const pascal = words.map(capitalize).join('')
  const kebab = words.join('-')
  const snake = words.join('_')
  const constant = words.map((w) => w.toUpperCase()).join('_')

  return [
    { label: 'camelCase', value: camel },
    { label: 'PascalCase', value: pascal },
    { label: 'kebab-case', value: kebab },
    { label: 'snake_case', value: snake },
    { label: 'CONST_CASE', value: constant },
  ]
})

async function copyValue(item) {
  const text = item?.value
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
    <label class="field-label">输入短语（中文、英文、空格/下划线/连字符分隔均可）</label>
    <input v-model="inputText" type="text" class="text-input" placeholder="例如：用户列表、user list、user_list" />

    <label class="field-label">生成结果</label>
    <ul class="result-list">
      <li v-for="item in results" :key="item.label" class="result-item">
        <span class="result-label">{{ item.label }}</span>
        <code class="result-value">{{ item.value }}</code>
        <button type="button" class="btn-copy" @click="copyValue(item)">复制</button>
      </li>
    </ul>
    <p v-if="!inputText.trim()" class="hint">输入内容后将自动生成各风格变量名。</p>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
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
  min-width: 90px;
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
  animation: fade 1.5s ease-out;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
