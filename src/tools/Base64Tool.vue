<script setup>
import { ref } from 'vue'

const inputText = ref('Hello')
const outputText = ref('')
const errorText = ref('')
const copyToast = ref('')

function encodeBase64() {
  errorText.value = ''
  try {
    outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
  } catch (e) {
    errorText.value = '编码失败：' + e.message
  }
}

function decodeBase64() {
  errorText.value = ''
  try {
    outputText.value = decodeURIComponent(escape(atob(inputText.value)))
  } catch (e) {
    errorText.value = '解码失败：非合法 Base64 或含非 Latin1 字符'
  }
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
    <label class="field-label">输入内容</label>
    <textarea v-model="inputText" rows="4" class="text-area" placeholder="编码：输入原文；解码：输入 Base64 字符串" />
    <div class="button-row">
      <button @click="encodeBase64">编码 → Base64</button>
      <button @click="decodeBase64">解码 ← Base64</button>
      <button @click="copyResult">复制结果</button>
    </div>
    <p v-if="errorText" class="error-text">{{ errorText }}</p>
    <label class="field-label">输出结果</label>
    <textarea :value="outputText" rows="4" class="text-area" readonly />
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
