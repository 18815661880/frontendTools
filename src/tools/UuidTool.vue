<script setup>
import { ref } from 'vue'

const uuidList = ref([])
const copyToast = ref('')

function randomUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generate(amount = 1) {
  const list = []
  for (let i = 0; i < amount; i++) list.push(randomUUID())
  uuidList.value = amount === 1 ? list : [...uuidList.value, ...list]
}

async function copyOne(uuid) {
  try {
    await navigator.clipboard.writeText(uuid)
    copyToast.value = '已复制'
    setTimeout(() => { copyToast.value = '' }, 1500)
  } catch {
    copyToast.value = '复制失败'
    setTimeout(() => { copyToast.value = '' }, 1500)
  }
}

async function copyAll() {
  if (uuidList.value.length === 0) return
  const text = uuidList.value.join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copyToast.value = '已复制全部'
    setTimeout(() => { copyToast.value = '' }, 1500)
  } catch {
    copyToast.value = '复制失败'
    setTimeout(() => { copyToast.value = '' }, 1500)
  }
}

function clearList() {
  uuidList.value = []
}
</script>

<template>
  <div class="tool-content">
    <div class="button-row">
      <button @click="generate(1)">生成 1 个</button>
      <button @click="generate(5)">生成 5 个</button>
      <button @click="generate(10)">生成 10 个</button>
      <button @click="copyAll" :disabled="uuidList.length === 0">复制全部</button>
      <button @click="clearList" :disabled="uuidList.length === 0">清空</button>
    </div>
    <ul v-if="uuidList.length > 0" class="uuid-list">
      <li v-for="(uuid, i) in uuidList" :key="i" class="uuid-item">
        <code>{{ uuid }}</code>
        <button type="button" class="btn-copy" @click="copyOne(uuid)">复制</button>
      </li>
    </ul>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.uuid-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.uuid-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}
.uuid-item code {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  word-break: break-all;
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
}
</style>
