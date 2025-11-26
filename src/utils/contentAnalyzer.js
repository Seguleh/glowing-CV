/**
 * Analyze content structure and detect sections
 * @param {string} text - Extracted text from PDF
 * @returns {Object} Content analysis results
 */
export function analyzeContent(text) {
    const lowerText = text.toLowerCase()

    // Define section patterns
    const sectionPatterns = {
        contact: /(?:contact|email|phone|address|linkedin)/i,
        summary: /(?:summary|profile|objective|about)/i,
        experience: /(?:experience|employment|work history|professional experience)/i,
        education: /(?:education|academic|degree|university|college)/i,
        skills: /(?:skills|competencies|technical skills|expertise)/i,
        certifications: /(?:certifications|certificates|licenses)/i,
        projects: /(?:projects|portfolio)/i,
        languages: /(?:languages|language proficiency)/i
    }

    // Detect sections
    const sections = Object.entries(sectionPatterns).map(([name, pattern]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        found: pattern.test(text)
    }))

    // Extract contact information
    const contactInfo = extractContactInfo(text)

    // Detect action verbs
    const actionVerbs = detectActionVerbs(text)

    // Detect quantifiable achievements
    const hasQuantifiableData = /\d+%|\d+\+|increased|decreased|improved|reduced|grew/i.test(text)

    // Analyze buzzwords (power words vs clichés)
    const buzzwordAnalysis = analyzeBuzzwords(text)

    // Analyze transition words for cohesion
    const transitionWords = detectTransitionWords(text)

    // Calculate readability metrics
    const readability = calculateReadability(text)

    return {
        sections,
        contactInfo,
        actionVerbs,
        hasQuantifiableData,
        wordCount: text.split(/\s+/).length,
        textLength: text.length,
        powerWords: buzzwordAnalysis.powerWords,
        cliches: buzzwordAnalysis.cliches,
        transitionWordCount: transitionWords,
        avgSentenceLength: readability.avgSentenceLength,
        readabilityScore: readability.score
    }
}

/**
 * Extract contact information from text
 * @param {string} text - Text to analyze
 * @returns {Object} Detected contact information
 */
function extractContactInfo(text) {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    const linkedInPattern = /linkedin\.com\/in\/[a-zA-Z0-9-]+/i

    return {
        hasEmail: emailPattern.test(text),
        hasPhone: phonePattern.test(text),
        hasLinkedIn: linkedInPattern.test(text)
    }
}

/**
 * Detect action verbs commonly used in resumes
 * @param {string} text - Text to analyze
 * @returns {number} Count of action verbs found
 */
function detectActionVerbs(text) {
    const actionVerbsList = [
        'achieved', 'managed', 'led', 'developed', 'created', 'implemented',
        'designed', 'built', 'improved', 'increased', 'reduced', 'optimized',
        'streamlined', 'coordinated', 'executed', 'delivered', 'launched',
        'established', 'initiated', 'spearheaded', 'drove', 'facilitated'
    ]

    const lowerText = text.toLowerCase()
    let count = 0

    actionVerbsList.forEach(verb => {
        const regex = new RegExp(`\\b${verb}\\b`, 'gi')
        const matches = lowerText.match(regex)
        if (matches) count += matches.length
    })

    return count
}

/**
 * Analyze buzzwords - power words (good) vs clichés (bad)
 * @param {string} text - Text to analyze
 * @returns {Object} Buzzword analysis
 */
function analyzeBuzzwords(text) {
    const lowerText = text.toLowerCase()

    // Power words that strengthen CVs
    const powerWordsList = [
        'achieved', 'accelerated', 'accomplished', 'delivered', 'exceeded',
        'generated', 'improved', 'increased', 'launched', 'pioneered',
        'reduced', 'resolved', 'transformed', 'optimized', 'streamlined',
        'spearheaded', 'orchestrated', 'championed', 'drove', 'executed'
    ]

    // Clichés to avoid
    const clichesList = [
        'team player', 'hard worker', 'detail-oriented', 'self-motivated',
        'go-getter', 'think outside the box', 'synergy', 'leverage',
        'best of breed', 'low-hanging fruit', 'move the needle'
    ]

    let powerWordCount = 0
    let clicheCount = 0

    powerWordsList.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        const matches = lowerText.match(regex)
        if (matches) powerWordCount += matches.length
    })

    clichesList.forEach(phrase => {
        if (lowerText.includes(phrase)) clicheCount++
    })

    return {
        powerWords: powerWordCount,
        cliches: clicheCount
    }
}

/**
 * Detect transition words for cohesion analysis
 * @param {string} text - Text to analyze
 * @returns {number} Count of transition words
 */
function detectTransitionWords(text) {
    const lowerText = text.toLowerCase()

    const transitionWordsList = [
        'furthermore', 'moreover', 'additionally', 'consequently',
        'therefore', 'however', 'nevertheless', 'meanwhile',
        'subsequently', 'accordingly', 'thus', 'hence',
        'resulted in', 'led to', 'contributed to', 'enabled'
    ]

    let count = 0

    transitionWordsList.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        const matches = lowerText.match(regex)
        if (matches) count += matches.length
    })

    return count
}

/**
 * Calculate readability metrics
 * @param {string} text - Text to analyze
 * @returns {Object} Readability metrics
 */
function calculateReadability(text) {
    // Split into sentences (rough approximation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)

    const avgSentenceLength = sentences.length > 0
        ? Math.round(words.length / sentences.length)
        : 0

    // Simple readability score (ideal: 15-20 words per sentence)
    let score = 10
    if (avgSentenceLength >= 15 && avgSentenceLength <= 20) {
        score = 10
    } else if (avgSentenceLength >= 10 && avgSentenceLength < 15) {
        score = 8
    } else if (avgSentenceLength > 20 && avgSentenceLength <= 25) {
        score = 7
    } else {
        score = 5
    }

    return {
        avgSentenceLength,
        score
    }
}

