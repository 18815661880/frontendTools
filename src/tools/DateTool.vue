<script setup>
import { ref } from 'vue'

const timestampInput = ref(String(Date.now()))
const dateInput = ref(new Date().toISOString().slice(0, 16))
const timestampResult = ref('')
const dateResult = ref('')

function timestampToDate() {
  const value = Number(timestampInput.value)
  if (Number.isNaN(value)) {
    dateResult.value = '请输入有效时间戳'
    return
  }

  const ms = String(Math.trunc(value)).length <= 10 ? value * 1000 : value
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    dateResult.value = '时间戳无法解析'
    return
  }
  dateResult.value = date.toLocaleString()
}

function dateToTimestamp() {
  const date = new Date(dateInput.value)
  if (Number.isNaN(date.getTime())) {
    timestampResult.value = '请输入有效日期'
    return
  }
  timestampResult.value = String(date.getTime())
}
</script>

<template>
  <div class="tool-content">
    <div class="block">
      <label class="field-label">时间戳转日期</label>
      <input v-model="timestampInput" type="text" class="text-input" />
      <div class="button-row">
        <button @click="timestampToDate">转换</button>
      </div>
      <p><strong>结果：</strong>{{ dateResult }}</p>
    </div>

    <div class="block">
      <label class="field-label">日期转时间戳</label>
      <input v-model="dateInput" type="datetime-local" class="text-input" />
      <div class="button-row">
        <button @click="dateToTimestamp">转换</button>
      </div>
      <p><strong>结果：</strong>{{ timestampResult }}</p>
    </div>
  </div>
</template>


<style scoped>
.tool-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-row {
  margin-top: 10px;
}
</style>