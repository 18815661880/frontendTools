<script setup>
import { ref, computed } from 'vue'

const mode = ref('en')
const paragraphCount = ref(3)
const sentencePerParagraph = ref(4)
const wordCount = ref(50)

const lorem = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse',
  'Cillum dolore eu fugiat nulla pariatur excepteur sint occaecat',
  'Cupidatat non proident sunt in culpa qui officia deserunt mollit',
]

const cnSentences = [
  '这是一段用于占位的示例文本。',
  '前端开发中经常需要填充内容以查看排版效果。',
  '可根据需要调整段落数与每段句数。',
]

function pick(arr, count) {
  const out = []
  for (let i = 0; i < count; i++) out.push(arr[i % arr.length])
  return out
}

const outputText = computed(() => {
  const p = Math.max(1, Math.min(20, Number(paragraphCount.value) || 1))
  const s = Math.max(1, Math.min(10, Number(sentencePerParagraph.value) || 2))
  const w = Math.max(10, Math.min(200, Number(wordCount.value) || 50))

  if (mode.value === 'en') {
    const sentences = pick(lorem, p * s)
    const paragraphs = []
    for (let i = 0; i < p; i++) {
      const slice = sentences.slice(i * s, (i + 1) * s)
      paragraphs.push(slice.join('. ') + '.')
    }
    return paragraphs.join('\n\n')
  }

  if (mode.value === 'en-words') {
    const words = lorem.join(' ').toLowerCase().split(/\s+/)
    const result = []
    let total = 0
    while (total < w) {
      const take = Math.min(words.length, w - total)
      result.push(...words.slice(0, take))
      total += take
    }
    return result.slice(0, w).join(' ')
  }

  const cn = pick(cnSentences, p * s)
  const paragraphs = []
  for (let i = 0; i < p; i++) {
    const slice = cn.slice(i * s, (i + 1) * s)
    paragraphs.push(slice.join(''))
  }
  return paragraphs.join('\n\n')
})

const copyToast = ref('')

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
    <label class="field-label">生成模式</label>
    <div class="button-row mode-row">
      <button
        :class="{ active: mode === 'en' }"
        type="button"
        @click="mode = 'en'"
      >
        英文段落
      </button>
      <button
        :class="{ active: mode === 'en-words' }"
        type="button"
        @click="mode = 'en-words'"
      >
        英文单词数
      </button>
      <button
        :class="{ active: mode === 'cn' }"
        type="button"
        @click="mode = 'cn'"
      >
        中文段落
      </button>
    </div>

    <div v-if="mode !== 'en-words'" class="input-row">
      <label class="field-label">段落数</label>
      <input v-model.number="paragraphCount" type="number" min="1" max="20" class="text-input input-num" />
      <label class="field-label">每段句数</label>
      <input v-model.number="sentencePerParagraph" type="number" min="1" max="10" class="text-input input-num" />
    </div>
    <div v-else class="input-row">
      <label class="field-label">单词数量</label>
      <input v-model.number="wordCount" type="number" min="10" max="500" class="text-input input-num" />
    </div>

    <label class="field-label">生成结果</label>
    <textarea :value="outputText" rows="8" class="text-area" readonly />
    <div class="button-row">
      <button @click="copyResult">复制结果</button>
    </div>
    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.mode-row button.active {
  background: #1d4ed8;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.input-num {
  width: 80px;
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
