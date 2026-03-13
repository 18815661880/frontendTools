<script setup>
import { ref, computed } from 'vue'

const baseFontSize = ref(16)
const pxInput = ref('')
const remInput = ref('')

const pxToRemResult = computed(() => {
  const base = Number(baseFontSize.value)
  if (!base || base <= 0) return ''
  const num = parseFloat(pxInput.value)
  if (Number.isNaN(num)) return ''
  return (num / base).toFixed(4).replace(/\.?0+$/, '') + 'rem'
})

const remToPxResult = computed(() => {
  const base = Number(baseFontSize.value)
  if (!base || base <= 0) return ''
  const num = parseFloat(remInput.value)
  if (Number.isNaN(num)) return ''
  return Math.round(num * base) + 'px'
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
    <div class="input-row">
      <label class="field-label">基准字号 (px)</label>
      <input v-model.number="baseFontSize" type="number" min="1" max="32" class="text-input input-num" />
    </div>

    <div class="block">
      <label class="field-label">PX → REM</label>
      <div class="convert-row">
        <input v-model="pxInput" type="text" class="text-input" placeholder="输入 px 数值，如 24" />
        <span class="arrow">→</span>
        <div class="result-wrap">
          <code class="result-value">{{ pxToRemResult || '—' }}</code>
          <button v-if="pxToRemResult" type="button" class="btn-copy" @click="copyText(pxToRemResult)">复制</button>
        </div>
      </div>
    </div>

    <div class="block">
      <label class="field-label">REM → PX</label>
      <div class="convert-row">
        <input v-model="remInput" type="text" class="text-input" placeholder="输入 rem 数值，如 1.5" />
        <span class="arrow">→</span>
        <div class="result-wrap">
          <code class="result-value">{{ remToPxResult || '—' }}</code>
          <button v-if="remToPxResult" type="button" class="btn-copy" @click="copyText(remToPxResult)">复制</button>
        </div>
      </div>
    </div>

    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-num {
  width: 80px;
}

.convert-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.convert-row .text-input {
  flex: 1;
  min-width: 140px;
}

.arrow {
  color: #6b7280;
  font-weight: 600;
}

.result-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.result-value {
  padding: 6px 10px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 14px;
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
