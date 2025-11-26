<template>
  <div id="app">
    <div class="container">
      <!-- Header -->
      <header class="header fade-in">
        <h1>📄 CVCheck</h1>
        <p class="subtitle">Optimize your resume for Applicant Tracking Systems</p>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <UploadZone 
          v-if="!analysisResults" 
          @file-uploaded="handleFileUpload"
          :is-analyzing="isAnalyzing"
        />
        
        <AnalysisResults 
          v-if="analysisResults && !isAnalyzing"
          :results="analysisResults"
          @analyze-new="resetAnalysis"
        />
        
        <!-- Loading State -->
        <div v-if="isAnalyzing" class="analyzing-state card fade-in">
          <div class="loader"></div>
          <h3>Analyzing your CV...</h3>
          <p>Extracting text, checking formatting, and calculating scores</p>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <p>Built with Vue.js • Runs 100% locally in your browser • Your data never leaves your device</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UploadZone from './components/UploadZone.vue'
import AnalysisResults from './components/AnalysisResults.vue'
import { analyzePDF } from './utils/pdfAnalyzer.js'

const isAnalyzing = ref(false)
const analysisResults = ref(null)

const handleFileUpload = async (file) => {
  isAnalyzing.value = true
  analysisResults.value = null
  
  try {
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Analyze the PDF
    const results = await analyzePDF(file)
    analysisResults.value = results
  } catch (error) {
    console.error('Analysis failed:', error)
    alert('Failed to analyze PDF. Please ensure it\'s a valid PDF file.')
  } finally {
    isAnalyzing.value = false
  }
}

const resetAnalysis = () => {
  analysisResults.value = null
  isAnalyzing.value = false
}
</script>

<style scoped>
.header {
  text-align: center;
  padding: var(--spacing-xl) 0 var(--spacing-lg) 0;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.main-content {
  min-height: 400px;
  margin: var(--spacing-lg) 0;
}

.analyzing-state {
  text-align: center;
  padding: var(--spacing-xl);
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md) auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--border);
  margin-top: var(--spacing-xl);
}
</style>
