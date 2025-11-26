import * as pdfjsLib from 'pdfjs-dist'
import { calculateATSScore } from './atsScorer.js'
import { analyzeContent } from './contentAnalyzer.js'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

/**
 * Main function to analyze a PDF file
 * @param {File} file - The PDF file to analyze
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzePDF(file) {
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        // Extract text from all pages
        const textContent = await extractAllText(pdf)

        // Analyze content structure
        const contentAnalysis = analyzeContent(textContent)

        // Calculate ATS score
        const scoreResults = calculateATSScore({
            textContent,
            contentAnalysis,
            fileSize: file.size,
            pageCount: pdf.numPages
        })

        return {
            overallScore: scoreResults.overallScore,
            categories: scoreResults.categories,
            recommendations: scoreResults.recommendations,
            sections: contentAnalysis.sections,
            metadata: {
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                pageCount: pdf.numPages,
                analyzedAt: new Date().toISOString()
            }
        }
    } catch (error) {
        console.error('PDF Analysis Error:', error)
        throw new Error('Failed to analyze PDF: ' + error.message)
    }
}

/**
 * Extract text from all pages of a PDF
 * @param {Object} pdf - PDF.js document object
 * @returns {Promise<string>} Extracted text
 */
async function extractAllText(pdf) {
    let fullText = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        const pageText = textContent.items
            .map(item => item.str)
            .join(' ')

        fullText += pageText + '\n\n'
    }

    return fullText.trim()
}

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
