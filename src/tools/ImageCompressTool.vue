<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const selectedFile = ref(null)
const originalUrl = ref('')
const compressedUrl = ref('')
const originalSize = ref(0)
const compressedSize = ref(0)
const quality = ref(0.8)
const maxWidth = ref(1920)
const outputType = ref('auto')
const errorText = ref('')
const isCompressing = ref(false)
const resultNote = ref('')

const reductionText = computed(() => {
  if (!originalSize.value || !compressedSize.value) return '-'
  const ratio = ((1 - compressedSize.value / originalSize.value) * 100).toFixed(1)
  return `${ratio}%`
})

const downloadName = computed(() => {
  if (!selectedFile.value) return 'compressed-image'
  const fileName = selectedFile.value.name.replace(/\.[^.]+$/, '')
  const extMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  const targetType = getTargetType(selectedFile.value.type)
  const ext = extMap[targetType] || 'jpg'
  return `${fileName}-compressed.${ext}`
})

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[index]}`
}

function getTargetType(sourceType) {
  if (outputType.value === 'auto') {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(sourceType)
      ? sourceType
      : 'image/jpeg'
  }
  return outputType.value
}

function getCandidateTypes(sourceType) {
  if (outputType.value !== 'auto') return [outputType.value]
  const list = [getTargetType(sourceType), 'image/webp', 'image/jpeg']
  return [...new Set(list)]
}

function normalizeQuality(value) {
  const q = Number(value)
  if (Number.isNaN(q)) return 0.8
  return Math.min(1, Math.max(0.1, q))
}

function revokePreviewUrls() {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
}

function resetCompressedData() {
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
  compressedUrl.value = ''
  compressedSize.value = 0
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  errorText.value = ''
  resultNote.value = ''
  resetCompressedData()

  if (!file) return
  if (!file.type.startsWith('image/')) {
    selectedFile.value = null
    errorText.value = '请选择图片文件'
    return
  }

  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  selectedFile.value = file
  originalSize.value = file.size
  originalUrl.value = URL.createObjectURL(file)
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片加载失败'))
    image.src = url
  })
}

function canvasToBlob(canvas, type, encoderQuality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('图片压缩失败'))
        return
      }
      resolve(blob)
    }, type, encoderQuality)
  })
}

async function compressImage() {
  if (!selectedFile.value || !originalUrl.value) {
    errorText.value = '请先选择图片'
    return
  }

  errorText.value = ''
  resultNote.value = ''
  isCompressing.value = true
  resetCompressedData()

  try {
    const image = await loadImage(originalUrl.value)
    const scale = Math.min(1, Number(maxWidth.value) / image.width)
    const targetWidth = Math.max(1, Math.round(image.width * scale))
    const targetHeight = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('浏览器不支持 Canvas')

    canvas.width = targetWidth
    canvas.height = targetHeight
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight)

    const sourceType = selectedFile.value.type
    const candidateTypes = getCandidateTypes(sourceType)
    const baseQuality = normalizeQuality(quality.value)
    let bestBlob = null
    let bestType = ''

    for (const type of candidateTypes) {
      const qualityCandidates = ['image/jpeg', 'image/webp'].includes(type)
        ? [baseQuality, Math.max(0.1, baseQuality - 0.15)]
        : [undefined]

      for (const q of qualityCandidates) {
        const blob = await canvasToBlob(canvas, type, q)
        if (!bestBlob || blob.size < bestBlob.size) {
          bestBlob = blob
          bestType = type
        }
      }
    }

    if (!bestBlob) throw new Error('压缩失败，请重试')

    if (bestBlob.size >= selectedFile.value.size) {
      compressedSize.value = selectedFile.value.size
      compressedUrl.value = URL.createObjectURL(selectedFile.value)
      resultNote.value = '当前参数下压缩后更大，已自动保留原图。可尝试降低质量或缩小最大宽度。'
      return
    }

    compressedSize.value = bestBlob.size
    compressedUrl.value = URL.createObjectURL(bestBlob)
    resultNote.value = `已自动选择更小结果（${bestType.replace('image/', '').toUpperCase()}）。`
  } catch (error) {
    errorText.value = error.message || '压缩失败，请重试'
  } finally {
    isCompressing.value = false
  }
}

onBeforeUnmount(() => {
  revokePreviewUrls()
})
</script>

<template>
  <div class="tool-content">
    <label class="field-label">选择图片</label>
    <input type="file" accept="image/*" @change="handleFileChange" />

    <div class="compress-options">
      <div class="option-item">
        <label class="field-label">最大宽度(px)</label>
        <input v-model.number="maxWidth" type="number" min="100" max="8000" class="text-input" />
      </div>
      <div class="option-item">
        <label class="field-label">质量(0~1)</label>
        <input v-model.number="quality" type="number" min="0.1" max="1" step="0.1" class="text-input" />
      </div>
      <div class="option-item">
        <label class="field-label">输出格式</label>
        <select v-model="outputType" class="text-input">
          <option value="auto">保持原格式</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </div>
    </div>

    <div class="button-row">
      <button :disabled="isCompressing" @click="compressImage">
        {{ isCompressing ? '压缩中...' : '开始压缩' }}
      </button>
      <a
        v-if="compressedUrl"
        :href="compressedUrl"
        :download="downloadName"
        class="download-link"
      >
        下载图片
      </a>
    </div>

    <p v-if="errorText" class="error-text">{{ errorText }}</p>
    <p v-if="resultNote" class="note-text">{{ resultNote }}</p>

    <div v-if="selectedFile" class="stats-box">
      <p><strong>原图大小：</strong>{{ formatBytes(originalSize) }}</p>
      <p><strong>压缩后：</strong>{{ formatBytes(compressedSize) }}</p>
      <p><strong>压缩率：</strong>{{ reductionText }}</p>
    </div>

    <div class="preview-grid" v-if="originalUrl || compressedUrl">
      <div v-if="originalUrl" class="preview-card">
        <p class="field-label">原图预览</p>
        <img :src="originalUrl" alt="original preview" />
      </div>
      <div v-if="compressedUrl" class="preview-card">
        <p class="field-label">压缩后预览</p>
        <img :src="compressedUrl" alt="compressed preview" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.compress-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.download-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 8px 14px;
  background: #0f766e;
  color: #ffffff;
  text-decoration: none;
}

.download-link:hover {
  background: #0d9488;
}

.stats-box {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.stats-box p {
  margin: 4px 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.preview-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
}

.preview-card img {
  width: 100%;
  max-height: 240px;
  object-fit: contain;
  border-radius: 8px;
  background: #f8fafc;
}

.note-text {
  margin: 0;
  color: #0f766e;
}
</style>
