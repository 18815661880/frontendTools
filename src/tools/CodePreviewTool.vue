<script setup>
import { ref, watch } from 'vue'

const htmlCode = ref(`<div style="padding: 16px; font-family: sans-serif;">
  <h2>代码预览</h2>
  <p>编辑左侧 HTML，右侧实时预览。</p>
</div>`)

const previewDoc = ref('')
let debounceTimer = null

function updatePreview() {
  const raw = htmlCode.value.trim()
  if (!raw) {
    previewDoc.value = '<body></body>'
    return
  }
  const wrapped = raw.startsWith('<!') ? raw : `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${raw}</body></html>`
  previewDoc.value = wrapped
}

function doUpdate() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 200)
}

watch(htmlCode, doUpdate, { immediate: true })
</script>

<template>
  <div class="tool-content code-preview">
    <label class="field-label">HTML 代码（可含 &lt;style&gt; / &lt;script&gt;）</label>
    <div class="preview-layout">
      <textarea v-model="htmlCode" class="code-area" spellcheck="false" placeholder="输入 HTML 片段或完整页面" />
      <div class="preview-wrap">
        <iframe
          v-if="previewDoc"
          :srcdoc="previewDoc"
          class="preview-frame"
          title="预览"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  min-height: 360px;
}

@media (max-width: 700px) {
  .preview-layout {
    grid-template-columns: 1fr;
  }
}

.code-area {
  width: 100%;
  min-height: 320px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
}

.preview-wrap {
  min-height: 320px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.preview-frame {
  width: 100%;
  height: 100%;
  min-height: 320px;
  border: none;
  display: block;
}
</style>
