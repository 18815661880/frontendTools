<script setup>
import { computed, ref } from 'vue'

const hex = ref('#409eff')
const copyTip = ref('')

const rgb = computed(() => {
  const clean = hex.value.replace('#', '')
  const value = clean.length === 3 ? clean.split('').map((s) => s + s).join('') : clean
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
})

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    copyTip.value = '复制成功'
  } catch (error) {
    copyTip.value = '复制失败，请手动复制'
  }

  window.setTimeout(() => {
    copyTip.value = ''
  }, 1500)
}
</script>

<template>
  <div class="tool-content">
    <label class="field-label">选择颜色</label>
    <div class="color-row">
      <input v-model="hex" type="color" class="color-input" />
      <input v-model="hex" type="text" class="text-input" />
    </div>

    <div class="preview-box" :style="{ backgroundColor: hex }" />

    <div class="value-row">
      <p><strong>HEX：</strong>{{ hex }}</p>
      <button type="button" class="copy-btn" @click="copyText(hex)">复制</button>
    </div>
    <div class="value-row">
      <p><strong>RGB：</strong>{{ rgb }}</p>
      <button type="button" class="copy-btn" @click="copyText(rgb)">复制</button>
    </div>
    <p v-if="copyTip" class="copy-tip">{{ copyTip }}</p>
  </div>
</template>

<style scoped>
.value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.value-row p {
  margin: 0;
}

.copy-btn {
  padding: 4px 10px;
  font-size: 13px;
}

.copy-tip {
  margin: 0;
  color: #0f766e;
  font-size: 13px;
}
</style>
