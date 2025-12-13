<template>
  <div class="upload-zone card fade-in">
    <div 
      class="drop-area"
      :class="{ 'drag-over': isDragOver, 'disabled': isAnalyzing }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <div class="upload-icon">📤</div>
      <h2>{{ isDragOver ? 'Drop your CV here' : 'Upload Your Resume' }}</h2>
      <p v-if="!isAnalyzing">
        Drag and drop your PDF or DOCX resume here, or click to browse
      </p>
      <p v-else class="analyzing-text">
        Analyzing...
      </p>
      
      <input 
        ref="fileInput"
        type="file"
        accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <div class="file-info" v-if="!isAnalyzing">
        <small>Supported formats: PDF, DOCX • Max size: 10MB</small>
      </div>
    </div>
    
    <!-- Features List -->
    <div class="features">
      <div class="feature">
        <span class="feature-icon">✅</span>
        <span>ATS Compatibility Score</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🔍</span>
        <span>Text Extractability Check</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📊</span>
        <span>Formatting Analysis</span>
      </div>
      <div class="feature">
        <span class="feature-icon">💡</span>
        <span>Actionable Recommendations</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['file-uploaded'])

const isDragOver = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  if (!props.isAnalyzing) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndEmit(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  
  if (props.isAnalyzing) return
  
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndEmit(file)
  }
}

const validateAndEmit = (file) => {
  // Check file type
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  // Also check extension as fallback
  const isDocx = file.name.toLowerCase().endsWith('.docx')
  
  if (!validTypes.includes(file.type) && !isDocx) {
    alert('Please upload a PDF or DOCX file')
    return
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    alert('File size must be less than 10MB')
    return
  }
  
  emit('file-uploaded', file)
}
</script>

<style scoped>
.upload-zone {
  max-width: 700px;
  margin: 0 auto;
}

.drop-area {
  border: 3px dashed var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(37, 99, 235, 0.05);
}

.drop-area:hover:not(.disabled) {
  border-color: var(--primary);
  background: rgba(37, 99, 235, 0.1);
  transform: scale(1.02);
}

.drop-area.drag-over {
  border-color: var(--primary);
  background: rgba(37, 99, 235, 0.15);
  transform: scale(1.05);
}

.drop-area.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-sm);
  animation: pulse 2s ease-in-out infinite;
}

.drop-area h2 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.drop-area p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.analyzing-text {
  color: var(--primary);
  font-weight: 500;
}

.file-info {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border);
}

.file-info small {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(37, 99, 235, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.feature-icon {
  font-size: 1.5rem;
}

.feature span:last-child {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
  
  .upload-icon {
    font-size: 3rem;
  }
}
</style>
