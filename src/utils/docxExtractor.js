import mammoth from 'mammoth'

/**
 * Extract text from a DOCX file
 * @param {File} file - The uploaded DOCX file
 * @returns {Promise<Object>} Extracted text and basic metadata
 */
export async function extractDocxText(file) {
    try {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })

        return {
            text: result.value, // The raw text
            messages: result.messages, // Any warnings
            formatting: {
                // DOCX extraction via mammoth doesn't provide detailed font/spacing info easily
                // We return empty/null to signal the scorer to skip advanced formatting checks
                fontSizes: [],
                uniqueFonts: [],
                lineHeights: []
            }
        }
    } catch (error) {
        console.error('DOCX Extraction Error:', error)
        throw new Error('Failed to extract text from DOCX: ' + error.message)
    }
}
