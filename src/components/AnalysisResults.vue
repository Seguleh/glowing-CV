<template>
  <div class="analysis-results fade-in">
    <!-- Overall Score Card -->
    <div class="score-card card">
      <h2>ATS Compatibility Score</h2>
      <div class="score-display">
        <div :class="['score-badge', getScoreClass(results.overallScore)]">
          {{ results.overallScore }}
        </div>
        <div class="score-label">
          <h3>{{ getScoreLabel(results.overallScore) }}</h3>
          <p>{{ getScoreDescription(results.overallScore) }}</p>
        </div>
      </div>
    </div>

    <!-- Score Breakdown -->
    <div class="breakdown-grid">
      <div 
        v-for="category in results.categories" 
        :key="category.name"
        class="category-card card"
      >
        <h4>{{ category.name }}</h4>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${(category.score / category.maxScore) * 100}%` }"
          ></div>
        </div>
        <div class="score-text">
          {{ category.score }} / {{ category.maxScore }} points
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="recommendations card" v-if="results.recommendations.length > 0">
      <h3>📋 Recommendations</h3>
      <ul class="recommendation-list">
        <li 
          v-for="(rec, index) in results.recommendations" 
          :key="index"
          :class="['recommendation-item', `priority-${rec.priority}`]"
        >
          <span class="priority-badge">{{ rec.priority }}</span>
          <span class="recommendation-text">{{ rec.message }}</span>
        </li>
      </ul>
    </div>

    <!-- Detected Sections -->
    <div class="sections card">
      <h3>📑 Detected Sections</h3>
      <div class="sections-grid">
        <div 
          v-for="section in results.sections" 
          :key="section.name"
          :class="['section-badge', section.found ? 'found' : 'missing']"
        >
          <span class="section-icon">{{ section.found ? '✓' : '✗' }}</span>
          <span>{{ section.name }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button @click="$emit('analyze-new')" class="btn btn-primary">
        Analyze Another CV
      </button>
      <button @click="exportResults" class="btn btn-secondary">
        Export Report
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['analyze-new'])

const getScoreClass = (score) => {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-fair'
  return 'score-poor'
}

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Improvement'
}

const getScoreDescription = (score) => {
  if (score >= 80) return 'Your CV is highly optimized for ATS systems'
  if (score >= 60) return 'Your CV should pass most ATS systems with minor improvements'
  if (score >= 40) return 'Your CV may have issues with some ATS systems'
  return 'Your CV needs significant improvements for ATS compatibility'
}

const exportResults = () => {
  const report = {
    score: props.results.overallScore,
    categories: props.results.categories,
    recommendations: props.results.recommendations,
    sections: props.results.sections,
    analyzedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cv-analysis-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.analysis-results {
  max-width: 900px;
  margin: 0 auto;
}

.score-card {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.score-label {
  text-align: left;
}

.score-label h3 {
  margin-bottom: var(--spacing-xs);
}

.score-label p {
  font-size: 0.9rem;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.category-card h4 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.score-text {
  margin-top: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: right;
}

.recommendations {
  margin-bottom: var(--spacing-lg);
}

.recommendation-list {
  list-style: none;
  margin-top: var(--spacing-md);
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  background: rgba(37, 99, 235, 0.05);
  border-radius: var(--radius-md);
  border-left: 3px solid;
}

.recommendation-item.priority-high {
  border-left-color: var(--error);
}

.recommendation-item.priority-medium {
  border-left-color: var(--warning);
}

.recommendation-item.priority-low {
  border-left-color: var(--primary);
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--bg-card);
  color: var(--text-primary);
  min-width: 60px;
  text-align: center;
}

.recommendation-text {
  flex: 1;
  color: var(--text-secondary);
}

.sections {
  margin-bottom: var(--spacing-lg);
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.section-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  border: 1px solid;
}

.section-badge.found {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--success);
  color: var(--success);
}

.section-badge.missing {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--error);
  color: var(--error);
}

.section-icon {
  font-weight: bold;
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .score-display {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .score-label {
    text-align: center;
  }
  
  .breakdown-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .actions button {
    width: 100%;
  }
}
</style>
