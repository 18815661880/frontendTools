<script setup>
import { ref } from 'vue'

const inputText = ref('{\n  "name": "frontend-tools",\n  "version": 1\n}')
const outputText = ref('')
const errorText = ref('')

function formatJson() {
  try {
    const parsed = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(parsed, null, 2)
    errorText.value = ''
  } catch (error) {
    errorText.value = `JSON 格式错误：${error.message}`
  }
}

function minifyJson() {
  try {
    const parsed = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(parsed)
    errorText.value = ''
  } catch (error) {
    errorText.value = `JSON 格式错误：${error.message}`
  }
}

function copyOutput() {
  if (!outputText.value) return
  navigator.clipboard.writeText(outputText.value)
}
</script>

<template>
  <div class="tool-content">
    <label class="field-label">输入 JSON</label>
    <textarea v-model="inputText" rows="10" class="text-area" />

    <div class="button-row">
      <button @click="formatJson">格式化</button>
      <button @click="minifyJson">压缩</button>
      <button @click="copyOutput">复制结果</button>
    </div>

    <p v-if="errorText" class="error-text">{{ errorText }}</p>

    <label class="field-label">输出结果</label>
    <textarea :value="outputText" rows="10" class="text-area" readonly />
  </div>
</template>
