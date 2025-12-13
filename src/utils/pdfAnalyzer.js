import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

/**
 * Extract text and metadata from a PDF file
 * @param {File} file - The PDF file to analyze
 * @returns {Promise<Object>} Extracted data
 */
export async function extractPdfData(file) {
    try {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        // Extract text and formatting from all pages
        const extracted = await extractAllText(pdf)

        return {
            text: extracted.text,
            formatting: extracted.formatting,
            pageCount: pdf.numPages,
            metadata: {
                pageCount: pdf.numPages
            }
        }
    } catch (error) {
        console.error('PDF Extraction Error:', error)
        throw new Error('Failed to extract PDF data: ' + error.message)
    }
}


/**
 * Extract text and formatting information from all pages of a PDF
 * @param {Object} pdf - PDF.js document object
 * @returns {Promise<Object>} Extracted text and formatting data
 */
async function extractAllText(pdf) {
    let fullText = ''
    const fontSizes = []
    const fonts = new Set()
    const lineHeights = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        let previousY = null

        textContent.items.forEach((item, index) => {
            // Extract text
            fullText += item.str + ' '

            // Extract font information
            if (item.height) {
                fontSizes.push(item.height)
            }

            if (item.fontName) {
                fonts.add(item.fontName)
            }

            // Calculate line spacing
            if (previousY !== null && item.transform && item.transform[5]) {
                const currentY = item.transform[5]
                const spacing = Math.abs(currentY - previousY)
                if (spacing > 0 && spacing < 100) { // Filter out page breaks
                    lineHeights.push(spacing)
                }
            }

            if (item.transform && item.transform[5]) {
                previousY = item.transform[5]
            }
        })

        fullText += '\n\n'
    }

    return {
        text: fullText.trim(),
        formatting: {
            fontSizes: fontSizes,
            uniqueFonts: Array.from(fonts),
            lineHeights: lineHeights
        }
    }
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
