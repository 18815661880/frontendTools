<script setup>
import { ref, computed } from 'vue'

const regexText = ref('\\d+')
const testText = ref('abc123def456')
const flags = ref('g')

const matchResult = computed(() => {
  if (!regexText.value.trim()) return { ok: false, error: '请输入正则' }
  try {
    const re = new RegExp(regexText.value, flags.value)
    const matches = [...testText.value.matchAll(re)]
    return { ok: true, matches }
  } catch (e) {
    return { ok: false, error: e.message }
  }
})
</script>

<template>
  <div class="tool-content">
    <div class="block">
      <label class="field-label">正则表达式</label>
      <input v-model="regexText" type="text" class="text-input" placeholder="例如：\d+ 或 [a-z]+" />
    </div>
    <div class="block">
      <label class="field-label">修饰符（可选）</label>
      <input v-model="flags" type="text" class="text-input" placeholder="g i m s u" style="max-width: 120px;" />
    </div>
    <div class="block">
      <label class="field-label">测试文本</label>
      <textarea v-model="testText" rows="4" class="text-area" placeholder="用于匹配的字符串" />
    </div>
    <div class="block">
      <label class="field-label">匹配结果</label>
      <p v-if="matchResult.ok === false" class="error-text">{{ matchResult.error }}</p>
      <template v-else-if="matchResult.matches.length === 0">
        <p class="muted">无匹配</p>
      </template>
      <ul v-else class="match-list">
        <li v-for="(m, i) in matchResult.matches" :key="i">
          <code>{{ m[0] }}</code>
          <span class="muted">index: {{ m.index }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.match-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.match-list li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.match-list code {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}
.muted {
  color: #64748b;
  font-size: 13px;
  margin: 0;
}
</style>
