<template>
  <div class="selector-container">
    <label for="industry-select" class="selector-label">Target Industry</label>
    <select 
      id="industry-select" 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
      class="selector-input"
      :disabled="disabled"
    >
      <option value="general">General / Standard</option>
      <option v-for="industry in industryProfiles.filter(i => i.id !== 'general')" :key="industry.id" :value="industry.id">
        {{ industry.name }}
      </option>
    </select>
    <p class="selector-help">Adjusts scoring weights based on industry standards</p>
  </div>
</template>

<script setup>
import { industryProfiles } from '../data/industryProfiles.js'

defineProps({
  modelValue: {
    type: String,
    default: 'general'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.selector-container {
  margin-bottom: var(--spacing-md);
}

.selector-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.selector-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.selector-input:focus {
  outline: none;
  border-color: var(--primary);
}

.selector-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.selector-help {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}
</style>
