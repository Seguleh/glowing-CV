export const industryProfiles = [
    {
        id: 'general',
        name: 'General / Standard',
        weights: {
            textExtractability: 1.0,
            sectionDetection: 1.0,
            formatting: 1.0,
            contactInfo: 1.0,
            contentQuality: 1.0,
            keywords: 1.0
        },
        description: 'Standard scoring balanced for most industries.'
    },
    {
        id: 'tech',
        name: 'Technology & Software',
        weights: {
            textExtractability: 1.0,
            sectionDetection: 0.8,
            formatting: 0.8,
            contactInfo: 1.0,
            contentQuality: 1.0,
            keywords: 1.5 // High emphasis on technical skills/keywords
        },
        description: 'Emphasizes technical skills and keyword matching.'
    },
    {
        id: 'creative',
        name: 'Creative & Design',
        weights: {
            textExtractability: 0.8, // Sometimes creative CVs are more visual
            sectionDetection: 0.8,
            formatting: 1.5, // High emphasis on layout and design (detected via consistency)
            contactInfo: 1.0,
            contentQuality: 1.0,
            keywords: 1.0
        },
        description: 'Emphasizes visual presentation and formatting.'
    },
    {
        id: 'corporate',
        name: 'Corporate & Legal',
        weights: {
            textExtractability: 1.2, // Must be very clean text
            sectionDetection: 1.2, // Standard sections are critical
            formatting: 1.2, // Conservative formatting expected
            contactInfo: 1.0,
            contentQuality: 1.2, // Professional language is key
            keywords: 0.8
        },
        description: 'Emphasizes standard structure, professional formatting, and text clarity.'
    },
    {
        id: 'academic',
        name: 'Academic & Research',
        weights: {
            textExtractability: 1.0,
            sectionDetection: 1.2, // Publications/Education sections important
            formatting: 1.0,
            contactInfo: 1.0,
            contentQuality: 1.2, // Detailed content important
            keywords: 1.0
        },
        description: 'Focuses on content depth and standard academic sections.'
    }
]
