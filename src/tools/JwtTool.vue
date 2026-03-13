<script setup>
import { ref, computed } from 'vue'

const jwtInput = ref('')

function base64UrlDecode(str) {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

const parsed = computed(() => {
  const raw = jwtInput.value.trim()
  if (!raw) return { error: '', data: null }
  const parts = raw.split('.')
  if (parts.length !== 3) {
    return { error: '无效 JWT：应为三段（header.payload.signature）', data: null }
  }
  try {
    const headerStr = base64UrlDecode(parts[0])
    const payloadStr = base64UrlDecode(parts[1])
    if (!headerStr || !payloadStr) {
      return { error: 'Base64 解码失败', data: null }
    }
    const header = JSON.parse(headerStr)
    const payload = JSON.parse(payloadStr)
    return {
      error: '',
      data: {
        header,
        payload,
        headerStr,
        payloadStr,
        signature: parts[2],
      },
    }
  } catch (e) {
    return { error: '解析失败：' + (e.message || '非合法 JSON'), data: null }
  }
})

const copyToast = ref('')

async function copyJson(label, str) {
  if (!str) return
  try {
    await navigator.clipboard.writeText(str)
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
    <label class="field-label">粘贴 JWT（Header.Payload.Signature）</label>
    <textarea v-model="jwtInput" rows="3" class="text-area" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.xxx" />
    <p v-if="parsed.error" class="error-text">{{ parsed.error }}</p>

    <template v-if="parsed.data">
      <div class="block">
        <div class="block-head">
          <span class="field-label">Header</span>
          <button type="button" class="btn-copy" @click="copyJson('header', parsed.data.headerStr)">复制</button>
        </div>
        <pre class="code-block">{{ JSON.stringify(parsed.data.header, null, 2) }}</pre>
      </div>
      <div class="block">
        <div class="block-head">
          <span class="field-label">Payload</span>
          <button type="button" class="btn-copy" @click="copyJson('payload', parsed.data.payloadStr)">复制</button>
        </div>
        <pre class="code-block">{{ JSON.stringify(parsed.data.payload, null, 2) }}</pre>
      </div>
      <div class="block">
        <span class="field-label">Signature（仅展示，不校验）</span>
        <code class="sig-code">{{ parsed.data.signature }}</code>
      </div>
    </template>

    <p v-if="copyToast" class="toast">{{ copyToast }}</p>
  </div>
</template>

<style scoped>
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.btn-copy {
  padding: 4px 10px;
  font-size: 13px;
}

.code-block {
  margin: 0;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.sig-code {
  display: block;
  margin-top: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  word-break: break-all;
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
