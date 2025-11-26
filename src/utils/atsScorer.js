/**
 * Calculate ATS compatibility score based on various criteria
 * @param {Object} data - Analysis data
 * @returns {Object} Scoring results
 */
export function calculateATSScore(data) {
    const { textContent, contentAnalysis, fileSize, pageCount } = data

    const categories = []
    const recommendations = []

    // 1. Text Extractability (25 points)
    const textScore = scoreTextExtractability(textContent, contentAnalysis)
    categories.push({
        name: 'Text Extractability',
        score: textScore.score,
        maxScore: 25
    })
    recommendations.push(...textScore.recommendations)

    // 2. Section Detection (20 points)
    const sectionScore = scoreSectionDetection(contentAnalysis.sections)
    categories.push({
        name: 'Section Detection',
        score: sectionScore.score,
        maxScore: 20
    })
    recommendations.push(...sectionScore.recommendations)

    // 3. Formatting (20 points)
    const formatScore = scoreFormatting(textContent, pageCount)
    categories.push({
        name: 'Formatting',
        score: formatScore.score,
        maxScore: 20
    })
    recommendations.push(...formatScore.recommendations)

    // 4. Contact Information (15 points)
    const contactScore = scoreContactInfo(contentAnalysis.contactInfo)
    categories.push({
        name: 'Contact Information',
        score: contactScore.score,
        maxScore: 15
    })
    recommendations.push(...contactScore.recommendations)

    // 5. Keywords & Content (10 points)
    const contentScore = scoreContent(contentAnalysis)
    categories.push({
        name: 'Keywords & Content',
        score: contentScore.score,
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
            message: 'Very little text was extracted. Your CV might be image-based. Use a text-based PDF format.'
        })
    }

    // Check text length is reasonable
    if (analysis.wordCount >= 200 && analysis.wordCount <= 1000) {
        score += 10
    } else if (analysis.wordCount < 200) {
        recommendations.push({
            priority: 'medium',
            message: 'Your CV seems too short. Aim for 200-1000 words for optimal ATS performance.'
        })
        score += 5
    } else {
        recommendations.push({
            priority: 'low',
            message: 'Your CV is quite long. Consider condensing to 1-2 pages for better ATS compatibility.'
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
                message: `Missing "${sectionName}" section. Add clear section headers for better ATS parsing.`
            })
        }
    })

    return { score, recommendations }
}

function scoreFormatting(text, pageCount) {
    let score = 10 // Base score
    const recommendations = []

    // Check page count (1-2 pages is ideal)
    if (pageCount <= 2) {
        score += 10
    } else {
        recommendations.push({
            priority: 'medium',
            message: `Your CV has ${pageCount} pages. Keep it to 1-2 pages for better ATS compatibility.`
        })
        score += 5
    }

    // Check for special characters that might cause issues
    const problematicChars = /[^\x00-\x7F]/g
    const specialCharCount = (text.match(problematicChars) || []).length

    if (specialCharCount > 50) {
        recommendations.push({
            priority: 'low',
            message: 'Reduce special characters and symbols. Use standard ASCII characters when possible.'
        })
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
            message: 'No email address detected. Add your email address for recruiters to contact you.'
        })
    }

    if (contactInfo.hasPhone) {
        score += 5
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'No phone number detected. Consider adding your phone number.'
        })
    }

    if (contactInfo.hasLinkedIn) {
        score += 3
    } else {
        recommendations.push({
            priority: 'low',
            message: 'No LinkedIn profile detected. Adding your LinkedIn can improve your professional presence.'
        })
    }

    return { score, recommendations }
}

function scoreContent(analysis) {
    let score = 0
    const recommendations = []

    // Check for action verbs
    if (analysis.actionVerbs >= 5) {
        score += 5
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'Use more action verbs (achieved, managed, led, developed) to describe your accomplishments.'
        })
        score += 2
    }

    // Check for quantifiable achievements
    if (analysis.hasQuantifiableData) {
        score += 5
    } else {
        recommendations.push({
            priority: 'medium',
            message: 'Add quantifiable achievements (e.g., "increased sales by 30%") to demonstrate impact.'
        })
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
            message: 'File size is large. Optimize your PDF to reduce file size for faster processing.'
        })
        score += 2
    }

    return { score, recommendations }
}
