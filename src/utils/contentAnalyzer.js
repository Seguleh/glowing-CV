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

    return {
        sections,
        contactInfo,
        actionVerbs,
        hasQuantifiableData,
        wordCount: text.split(/\s+/).length,
        textLength: text.length
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
