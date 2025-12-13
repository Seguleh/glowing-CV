
import { calculateATSScore } from './src/utils/atsScorer.js';

const mockData = {
    textContent: "I am a frontend developer with experience in HTML and CSS.",
    contentAnalysis: {
        wordCount: 300,
        sections: [
            { name: 'Contact', found: true },
            { name: 'Experience', found: true },
            { name: 'Education', found: true },
            { name: 'Skills', found: true }
        ],
        contactInfo: { hasEmail: true, hasPhone: true, hasLinkedIn: true },
        actionVerbs: 10,
        hasQuantifiableData: true,
        powerWords: 5,
        cliches: 0,
        transitionWordCount: 5,
        readabilityScore: 10,
        avgSentenceLength: 15
    },
    fileSize: 100000,
    pageCount: 1,
    jobProfile: {
        id: 'frontend-dev',
        title: 'Frontend Developer',
        level: 'mid',
        keywords: [
            'javascript', 'typescript', 'vue', 'react', 'angular', 'html', 'css', 'sass',
            'webpack', 'vite', 'git', 'responsive', 'accessibility', 'dom', 'api', 'rest',
            'frontend', 'ui', 'ux', 'state management', 'testing', 'jest', 'cypress'
        ]
    },
    industryProfile: {
        weights: {
            textExtractability: 1.0,
            sectionDetection: 1.0,
            formatting: 1.0,
            contactInfo: 1.0,
            contentQuality: 1.0,
            keywords: 1.0
        }
    },
    formattingData: {
        fontSizes: [12, 14, 16],
        uniqueFonts: ['Arial'],
        lineHeights: [1.2, 1.5],
        fontConsistency: { uniqueFontCount: 1 },
        fontSizeVariance: 2,
        spacingConsistency: true
    }
};

const result = calculateATSScore(mockData);
console.log("Overall Score:", result.overallScore);
console.log("Categories:", JSON.stringify(result.categories, null, 2));
console.log("Recommendations:", JSON.stringify(result.recommendations.filter(r => r.message.includes('keyword')), null, 2));
