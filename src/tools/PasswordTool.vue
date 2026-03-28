<script setup>
import { ref, computed, watch } from 'vue'

const length = ref(16)
const difficulty = ref('custom') // custom | easy | medium | strong | ultra
const useDigits = ref(true)
const useLower = ref(true)
const useUpper = ref(true)
const useSymbols = ref(false)
const excludeChars = ref('')
const includeChars = ref('')

const output = ref('')
const errorText = ref('')
const copyToast = ref('')

const DIGITS = '0123456789'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?|~'

watch(difficulty, (val) => {
  if (val === 'custom') return
  if (val === 'easy') {
    useDigits.value = true
    useLower.value = false
    useUpper.value = false
    useSymbols.value = false
  } else if (val === 'medium') {
    useDigits.value = true
    useLower.value = true
    useUpper.value = false
    useSymbols.value = false
  } else if (val === 'strong') {
    useDigits.value = true
    useLower.value = true
    useUpper.value = true
    useSymbols.value = false
  } else if (val === 'ultra') {
    useDigits.value = true
    useLower.value = true
    useUpper.value = true
    useSymbols.value = true
  }
})

const charPool = computed(() => {
  let pool = ''
  if (useDigits.value) pool += DIGITS
  if (useLower.value) pool += LOWER
  if (useUpper.value) pool += UPPER
  if (useSymbols.value) pool += SYMBOLS
  const excludes = new Set([...excludeChars.value])
  if (excludes.size > 0) {
    pool = [...pool].filter((c) => !excludes.has(c)).join('')
  }
  return pool
})

function secureRandomInt(maxExclusive) {
  if (maxExclusive <= 0) return 0
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Rejection sampling to avoid modulo bias
    const maxUint32 = 0xffffffff
    const limit = Math.floor(maxUint32 / maxExclusive) * maxExclusive
    const buf = new Uint32Array(1)
    while (true) {
      crypto.getRandomValues(buf)
      const x = buf[0]
      if (x < limit) return x % maxExclusive
    }
  }
  return Math.floor(Math.random() * maxExclusive)
}

function generate() {
  errorText.value = ''
  const len = Math.max(1, Math.min(128, Number(length.value) || 0))
  length.value = len
  const pool = charPool.value
  if (!pool) {
    errorText.value = '可用字符集为空，请检查选择与排除字符。'
    output.value = ''
    return
  }
  // 处理必须包含的字符（去重，过滤被排除的）
  const excludes = new Set([...excludeChars.value])
  const includeList = Array.from(new Set([...includeChars.value].filter((c) => !excludes.has(c))))
  if (includeList.length > len) {
    errorText.value = '包含字符数量超过密码长度，请调整长度或包含字符。'
    output.value = ''
    return
  }
  // 若包含字符不在当前池中，但未被排除，则将其加入有效字符池
  let effectivePool = pool
  const needAppend = includeList.filter((c) => !effectivePool.includes(c))
  if (needAppend.length) effectivePool += needAppend.join('')

  const result = [...includeList]
  while (result.length < len) {
    const idx = secureRandomInt(effectivePool.length)
    result.push(effectivePool[idx])
  }
  // 打乱顺序
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    const t = result[i]
    result[i] = result[j]
    result[j] = t
  }
  output.value = result.join('')
}

async function copyResult() {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copyToast.value = '已复制'
    setTimeout(() => { copyToast.value = '' }, 1500)
  } catch {
    copyToast.value = '复制失败'
    setTimeout(() => { copyToast.value = '' }, 1500)
  }
}

function clearAll() {
  output.value = ''
}
</script>

<template>
  <div class="tool-content">
    <div class="form-grid">
      <div class="form-col">
        <label class="field-label">密码长度</label>
        <div class="input-row">
          <input v-model.number="length" type="number" min="1" max="128" class="text-input" />
          <span class="label-inline">范围 1 - 128</span>
        </div>
      </div>

      <div class="form-col">
        <label class="field-label">难度</label>
        <select v-model="difficulty" class="text-input">
          <option value="custom">自定义</option>
          <option value="easy">简单（数字）</option>
          <option value="medium">中等（数字+小写）</option>
          <option value="strong">强（数字+大小写）</option>
          <option value="ultra">超强（数字+大小写+符号）</option>
        </select>
      </div>
    </div>

    <label class="field-label">使用的字符集</label>
    <div class="checkbox-row">
      <label class="checkbox-item">
        <input type="checkbox" v-model="useDigits" />
        <span>数字 0-9</span>
      </label>
      <label class="checkbox-item">
        <input type="checkbox" v-model="useLower" />
        <span>小写 a-z</span>
      </label>
      <label class="checkbox-item">
        <input type="checkbox" v-model="useUpper" />
        <span>大写 A-Z</span>
      </label>
      <label class="checkbox-item">
        <input type="checkbox" v-model="useSymbols" />
        <span>符号 !@# 等</span>
      </label>
    </div>

    <label class="field-label">排除字符（不包含在结果中）</label>
    <input v-model="excludeChars" type="text" class="text-input" placeholder="如：oO0lI`'&quot;\\ 空格等" />

    <label class="field-label">包含字符（结果中至少包含一次）</label>
    <input v-model="includeChars" type="text" class="text-input" placeholder="如：必须出现的前后缀或特定符号" />

    <div class="button-row">
      <button type="button" @click="generate">生成</button>
      <button type="button" @click="copyResult" :disabled="!output">复制</button>
      <button type="button" @click="clearAll" :disabled="!output">清空</button>
    </div>

    <label class="field-label">生成结果</label>
    <input :value="output" readonly type="text" class="text-input" placeholder="点击生成" />
    <p v-if="errorText" class="error-text">{{ errorText }}</p>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 12px;
  /* align-items: end; */
}
.form-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
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
.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
}
.checkbox-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}
.error-text {
  color: #dc2626;
  margin: 8px 0 0;
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

