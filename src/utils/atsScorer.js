import { analyzeFormatting } from './formattingAnalyzer.js'

/**
 * Calculate ATS compatibility score based on various criteria
 * @param {Object} data - Analysis data
 * @returns {Object} Scoring results
 */
export function calculateATSScore(data) {
    const { textContent, contentAnalysis, fileSize, pageCount, jobProfile, industryProfile, formattingData } = data

    const categories = []
    const recommendations = []

    // Get industry weights (default to 1.0 for all)
    const weights = industryProfile?.weights || {
        textExtractability: 1.0,
        sectionDetection: 1.0,
        formatting: 1.0,
        contactInfo: 1.0,
        contentQuality: 1.0,
        keywords: 1.0
    }

    // 1. Text Extractability (25 points)
    const textScore = scoreTextExtractability(textContent, contentAnalysis)
    categories.push({
        name: 'Text Extractability',
        score: Math.round(textScore.score * weights.textExtractability),
        maxScore: 25
    })
    recommendations.push(...textScore.recommendations)

    // 2. Section Detection (20 points)
    const sectionScore = scoreSectionDetection(contentAnalysis.sections)
    categories.push({
        name: 'Section Detection',
        score: Math.round(sectionScore.score * weights.sectionDetection),
        maxScore: 20
    })
    recommendations.push(...sectionScore.recommendations)

    // 3. Formatting (20 points)
    const formatScore = scoreFormatting(textContent, pageCount, formattingData)
    categories.push({
        name: 'Formatting',
        score: Math.round(formatScore.score * weights.formatting),
        maxScore: 20
    })
    recommendations.push(...formatScore.recommendations)

    // 4. Contact Information (15 points)
    const contactScore = scoreContactInfo(contentAnalysis.contactInfo)
    categories.push({
        name: 'Contact Information',
        score: Math.round(contactScore.score * weights.contactInfo),
        maxScore: 15
    })
    recommendations.push(...contactScore.recommendations)

    // 5. Keywords & Content (10 points)
    const contentScore = scoreContent(contentAnalysis)
    categories.push({
        name: 'Keywords & Content',
        score: Math.round(contentScore.score * weights.contentQuality),
        maxScore: 10
    })
    recommendations.push(...contentScore.recommendations)

    // 6. File Optimization (10 points)
    const fileScore = scoreFileOptimization(fileSize, pageCount)
    categories.push({
        name: 'File Optimization',
        score: fileScore.score,
        maxScore: 10
    })
    recommendations.push(...fileScore.recommendations)

    // 7. Job Match (if job profile selected) - BONUS category
    if (jobProfile && jobProfile.keywords && jobProfile.keywords.length > 0) {
        const jobMatchScore = scoreJobMatch(textContent, jobProfile)
        categories.push({
            name: `Job Match: ${jobProfile.title}`,
            score: jobMatchScore.score,
            maxScore: 15
        })
        recommendations.push(...jobMatchScore.recommendations)
    }

    // Calculate overall score
    const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0)

    return {
        overallScore: Math.round(totalScore),
        categories,
        recommendations: recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
    }
}

function scoreTextExtractability(text, analysis) {
    let score = 0
    const recommendations = []

    // Check if text was extracted
    if (text.length > 100) {
        score += 15
    } else {
        recommendations.push({
            priority: 'high',
            message: 'Very little text was extracted. Your CV might be image-based. Use a text-based PDF format.',
            location: 'Entire CV - recreate using a text-based format'
        })
    }

    // Check text length is reasonable
    if (analysis.wordCount >= 200 && analysis.wordCount <= 1000) {
        score += 10
    } else if (analysis.wordCount < 200) {
        recommendations.push({
            priority: 'medium',
            message: 'Your CV seems too short. Aim for 200-1000 words for optimal ATS performance.',
            location: 'Experience and Education sections - add more detail'
        })
        score += 5
    } else {
        recommendations.push({
            priority: 'low',
            message: 'Your CV is quite long. Consider condensing to 1-2 pages for better ATS compatibility.',
            location: 'Throughout CV - remove less relevant information'
        })
        score += 8
    }

    return { score, recommendations }
}

function scoreSectionDetection(sections) {
    let score = 0
    const recommendations = []

    const criticalSections = ['Contact', 'Experience', 'Education', 'Skills']
    const foundCritical = sections.filter(s =>
        criticalSections.includes(s.name) && s.found
    )

    // 5 points per critical section found
    score = foundCritical.length * 5

    // Check for missing critical sections
    criticalSections.forEach(sectionName => {
        const section = sections.find(s => s.name === sectionName)
        if (!section || !section.found) {
            recommendations.push({
                priority: 'high',
                message: `Missing "${sectionName}" section. Add clear section headers for better ATS parsing.`,
                location: `Add "${sectionName}" section with clear heading`
            })
        }
    })

    return { score, recommendations }
}

function scoreFormatting(text, pageCount, formattingData) {
    let score = 5 // Base score
    const recommendations = []

    // Check page count (1-2 pages is ideal)
    if (pageCount <= 2) {
        score += 5
    } else {
        recommendations.push({
            priority: 'medium',
            message: `Your CV has ${pageCount} pages. Keep it to 1-2 pages for better ATS compatibility.`,
            location: 'Throughout CV - condense content'
        })
        score += 2
    }

    // Check for special characters that might cause issues
    const problematicChars = /[^\x00-\x7F]/g
    const specialCharCount = (text.match(problematicChars) || []).length

    if (specialCharCount > 50) {
        recommendations.push({
            priority: 'low',
            message: 'Reduce special characters and symbols. Use standard ASCII characters when possible.',
            location: 'Throughout CV - replace special symbols'
        })
    } else {
        score += 2
    }

    // Advanced formatting analysis (if data available)
    if (formattingData && formattingData.fontSizes && formattingData.fontSizes.length > 0) {
        const formatting = analyzeFormatting(formattingData)

        // Font consistency check
        if (formatting.fontConsistency.uniqueFontCount <= 2) {
            score += 4
        } else if (formatting.fontConsistency.uniqueFontCount <= 3) {
            score += 2
        } else {
            recommendations.push({
                priority: 'medium',
                message: `Multiple fonts detected (${formatting.fontConsistency.uniqueFontCount}). Stick to 1-2 fonts for professional appearance.`,
                location: 'Throughout CV - standardize font choices'
            })
            score += 1
        }

        // Font size consistency
        if (formatting.fontSizeVariance <= 4) {
            score += 3
        } else if (formatting.fontSizeVariance <= 6) {
            score += 2
        } else {
            recommendations.push({
                priority: 'low',
                message: `Inconsistent font sizes detected (${formatting.fontSizeVariance} different sizes). Use consistent sizing for body text.`,
                location: 'Throughout CV - standardize font sizes'
            })
            score += 1
        }

        // Spacing consistency
        if (formatting.spacingConsistency) {
            score += 3
        } else {
            recommendations.push({
                priority: 'low',
                message: 'Inconsistent line spacing detected. Use uniform spacing for better readability.',
                location: 'Throughout CV - adjust line spacing settings'
            })
            score += 1
        }
    } else {
        // If no formatting data, give partial credit
        score += 5
    }

    return { score, recommendations }
}

function scoreContactInfo(contactInfo) {
    let score = 0
    const recommendations = []

    if (contactInfo.hasEmail) {
        score += 7
    } else {
        recommendations.push({
            priority: 'high',
            message: 'No email address detected. Add your email address for recruiters to contact you.',
            location: 'Contact section at top of CV'
        })
    }

    if (contactInfo.hasPhone) {
        score += 5
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'No phone number detected. Consider adding your phone number.',
            location: 'Contact section at top of CV'
        })
    }

    if (contactInfo.hasLinkedIn) {
        score += 3
    } else {
        recommendations.push({
            priority: 'low',
            message: 'No LinkedIn profile detected. Adding your LinkedIn can improve your professional presence.',
            location: 'Contact section at top of CV'
        })
    }

    return { score, recommendations }
}

function scoreContent(analysis) {
    let score = 0
    const recommendations = []

    // Check for action verbs
    if (analysis.actionVerbs >= 5) {
        score += 2
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'Use more action verbs (achieved, managed, led, developed) to describe your accomplishments.',
            location: 'Experience section - start bullet points with action verbs'
        })
        score += 1
    }

    // Check for quantifiable achievements
    if (analysis.hasQuantifiableData) {
        score += 2
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'Add quantifiable achievements (e.g., "increased sales by 30%") to demonstrate impact.',
            location: 'Experience section - add metrics to accomplishments'
        })
    }

    // Power words (bonus points)
    if (analysis.powerWords >= 5) {
        score += 2
    } else if (analysis.powerWords >= 3) {
        score += 1
    } else {
        recommendations.push({
            priority: 'low',
            message: 'Use more power words (achieved, transformed, pioneered) to strengthen your CV.',
            location: 'Experience and Summary sections'
        })
    }

    // Clichés (penalty)
    if (analysis.cliches > 3) {
        recommendations.push({
            priority: 'high',
            message: `Avoid clichés like "team player" or "detail-oriented" (found ${analysis.cliches}). Use specific examples instead.`,
            location: 'Summary and Experience sections - replace with concrete examples'
        })
    } else if (analysis.cliches > 0) {
        score += 1
        recommendations.push({
            priority: 'low',
            message: 'Minimize clichés. Replace with concrete achievements.',
            location: 'Summary section'
        })
    } else {
        score += 2
    }

    // Transition words for cohesion
    if (analysis.transitionWordCount >= 3) {
        score += 1
    } else {
        recommendations.push({
            priority: 'low',
            message: 'Use transition words (furthermore, consequently, resulted in) to improve flow and cohesion.',
            location: 'Experience descriptions'
        })
    }

    // Readability
    if (analysis.readabilityScore >= 8) {
        score += 1
    } else {
        const avgLen = analysis.avgSentenceLength
        if (avgLen > 25) {
            recommendations.push({
                priority: 'medium',
                message: `Sentences are too long (avg ${avgLen} words). Aim for 15-20 words per sentence for better readability.`,
                location: 'Throughout CV - break long sentences'
            })
        } else if (avgLen < 10) {
            recommendations.push({
                priority: 'low',
                message: `Sentences are too short (avg ${avgLen} words). Aim for 15-20 words per sentence.`,
                location: 'Throughout CV - combine short sentences'
            })
        }
    }

    return { score, recommendations }
}

function scoreFileOptimization(fileSize, pageCount) {
    let score = 5 // Base score
    const recommendations = []

    const maxRecommendedSize = 2 * 1024 * 1024 // 2MB

    if (fileSize <= maxRecommendedSize) {
        score += 5
    } else {
        recommendations.push({
            priority: 'low',
            message: 'File size is large. Optimize your PDF to reduce file size for faster processing.',
            location: 'PDF export settings - reduce image quality or compress'
        })
        score += 2
    }

    return { score, recommendations }
}

function scoreJobMatch(textContent, jobProfile) {
    let score = 0
    const recommendations = []

    const lowerText = textContent.toLowerCase()
    const keywords = jobProfile.keywords

    // Count matched and missing keywords
    let matchedCount = 0
    const matchedKeywords = []
    const missingKeywords = []

    keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase()
        if (lowerText.includes(keywordLower)) {
            matchedCount++
            matchedKeywords.push(keyword)
        } else {
            missingKeywords.push(keyword)
        }
    })

    // Calculate match percentage
    const matchPercentage = (matchedCount / keywords.length) * 100

    // Adjust thresholds based on seniority level
    const level = jobProfile.level || 'mid'
    let excellentThreshold, goodThreshold, fairThreshold

    if (level === 'executive') {
        // C-suite: Higher expectations for strategic keywords
        excellentThreshold = 60
        goodThreshold = 40
        fairThreshold = 25
    } else if (level === 'senior') {
        // Senior: Moderate-high expectations
        excellentThreshold = 65
        goodThreshold = 45
        fairThreshold = 30
    } else {
        // Mid-level: Standard expectations
        excellentThreshold = 70
        goodThreshold = 50
        fairThreshold = 30
    }

    // Get sample missing keywords for recommendations
    const getSampleKeywords = (count) => {
        return missingKeywords.slice(0, count).join(', ')
    }

    // Score based on match percentage (0-15 points)
    if (matchPercentage >= excellentThreshold) {
        score = 15
    } else if (matchPercentage >= goodThreshold) {
        score = 12
        const samples = getSampleKeywords(3)
        recommendations.push({
            priority: 'medium',
            message: `Good keyword match (${Math.round(matchPercentage)}%). Consider adding: ${samples}`,
            location: 'Skills section or Experience descriptions'
        })
    } else if (matchPercentage >= fairThreshold) {
        score = 8
        const samples = getSampleKeywords(5)
        recommendations.push({
            priority: 'high',
            message: `Moderate keyword match (${Math.round(matchPercentage)}%). Missing keywords: ${samples}${missingKeywords.length > 5 ? ', and more' : ''}`,
            location: 'Skills section and Experience bullet points'
        })
    } else {
        score = 4
        const samples = getSampleKeywords(5)
        recommendations.push({
            priority: 'high',
            message: `Low keyword match (${Math.round(matchPercentage)}%). Add relevant keywords like: ${samples}${missingKeywords.length > 5 ? ', and more' : ''}`,
            location: 'Throughout CV - especially Skills, Experience, and Summary sections'
        })
    }

    return { score, recommendations }
}
