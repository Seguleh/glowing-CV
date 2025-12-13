import { extractPdfData } from './pdfAnalyzer.js'
import { extractDocxText } from './docxExtractor.js'
import { analyzeContent } from './contentAnalyzer.js'
import { calculateATSScore } from './atsScorer.js'

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * Main function to analyze a document (PDF or DOCX)
 * @param {File} file - The file to analyze
 * @param {Object} context - Analysis context (jobProfile, industryProfile)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeDocument(file, context = {}) {
    try {
        let extractedData

        // Determine file type and extract data
        if (file.type === 'application/pdf') {
            extractedData = await extractPdfData(file)
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.name.endsWith('.docx')
        ) {
            extractedData = await extractDocxText(file)
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
        }

        const { text, formatting, pageCount, metadata } = extractedData

        // Analyze content structure
        const contentAnalysis = analyzeContent(text)

        // Calculate ATS score with context and formatting data
        const scoreResults = calculateATSScore({
            textContent: text,
            contentAnalysis,
            fileSize: file.size,
            pageCount: pageCount || 1, // Default to 1 if page count unknown (DOCX)
            jobProfile: context.jobProfile,
            industryProfile: context.industryProfile,
            formattingData: formatting
        })

        return {
            overallScore: scoreResults.overallScore,
            categories: scoreResults.categories,
            recommendations: scoreResults.recommendations,
            sections: contentAnalysis.sections,
            metadata: {
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                pageCount: pageCount || 'N/A',
                analyzedAt: new Date().toISOString(),
                targetJob: context.jobProfile?.title || 'General',
                targetIndustry: context.industryProfile?.name || 'General',
                fileType: file.name.split('.').pop().toUpperCase()
            }
        }
    } catch (error) {
        console.error('Document Analysis Error:', error)
        throw new Error('Failed to analyze document: ' + error.message)
    }
}
