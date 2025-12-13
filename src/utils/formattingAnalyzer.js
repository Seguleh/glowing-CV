/**
 * Analyze formatting consistency from PDF data
 * @param {Object} formattingData - Font and spacing data from PDF
 * @returns {Object} Formatting analysis results
 */
export function analyzeFormatting(formattingData) {
    const { fontSizes, uniqueFonts, lineHeights } = formattingData

    // Analyze font size consistency
    const fontSizeAnalysis = analyzeFontSizes(fontSizes)

    // Analyze font consistency
    const fontConsistency = {
        uniqueFontCount: uniqueFonts.length,
        fonts: uniqueFonts,
        isConsistent: uniqueFonts.length <= 3 // Ideal: 1-3 fonts
    }

    // Analyze spacing consistency
    const spacingAnalysis = analyzeSpacing(lineHeights)

    return {
        fontSizeVariance: fontSizeAnalysis.variance,
        dominantFontSize: fontSizeAnalysis.dominant,
        fontSizeRange: fontSizeAnalysis.range,
        fontConsistency,
        spacingConsistency: spacingAnalysis.isConsistent,
        averageLineHeight: spacingAnalysis.average,
        spacingVariance: spacingAnalysis.variance
    }
}

/**
 * Analyze font size distribution
 * @param {Array} fontSizes - Array of font sizes
 * @returns {Object} Font size analysis
 */
function analyzeFontSizes(fontSizes) {
    if (fontSizes.length === 0) {
        return { variance: 0, dominant: 0, range: 0 }
    }

    // Calculate frequency of each size
    const sizeFrequency = {}
    fontSizes.forEach(size => {
        const rounded = Math.round(size * 10) / 10
        sizeFrequency[rounded] = (sizeFrequency[rounded] || 0) + 1
    })

    // Find dominant size
    let dominantSize = 0
    let maxCount = 0
    Object.entries(sizeFrequency).forEach(([size, count]) => {
        if (count > maxCount) {
            maxCount = count
            dominantSize = parseFloat(size)
        }
    })

    // Calculate variance
    const uniqueSizes = Object.keys(sizeFrequency).length
    const min = Math.min(...fontSizes)
    const max = Math.max(...fontSizes)

    return {
        variance: uniqueSizes,
        dominant: dominantSize,
        range: max - min
    }
}

/**
 * Analyze spacing consistency
 * @param {Array} lineHeights - Array of line spacing values
 * @returns {Object} Spacing analysis
 */
function analyzeSpacing(lineHeights) {
    if (lineHeights.length === 0) {
        return { isConsistent: true, average: 0, variance: 0 }
    }

    const average = lineHeights.reduce((sum, h) => sum + h, 0) / lineHeights.length

    // Calculate standard deviation
    const squaredDiffs = lineHeights.map(h => Math.pow(h - average, 2))
    const variance = Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / lineHeights.length)

    // Consider consistent if variance is low relative to average
    const isConsistent = variance < (average * 0.3)

    return {
        isConsistent,
        average: Math.round(average * 10) / 10,
        variance: Math.round(variance * 10) / 10
    }
}
