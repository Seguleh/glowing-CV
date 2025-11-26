# 📄 CVCheck - ATS Compatibility Checker

CVCheck is a privacy-first, local web application that analyzes PDF resumes for Applicant Tracking System (ATS) compatibility. It provides actionable recommendations to help job seekers optimize their CVs for recruitment algorithms.

![CVCheck Application Interface](/C:/Users/aezhc/.gemini/antigravity/brain/d45fa7a2-1b59-42a1-ba48-b0f43b0e5240/cvcheck_interface_1764150849932.png)

## ✨ Key Features

- **Privacy-First**: All analysis happens locally in your browser. Your data never leaves your device.
- **ATS Scoring**: Comprehensive 100-point scoring system across 6 categories.
- **PDF Analysis**: Advanced text extraction and structure analysis using PDF.js.
- **Actionable Insights**: Prioritized recommendations to improve your CV's performance.
- **Modern UI**: Professional, dark-themed interface with drag & drop support.
- **Export Results**: Download detailed analysis reports as JSON.

## 🛠️ Technology Stack

- **Frontend Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/)
- **Styling**: Vanilla CSS with CSS Custom Properties (Variables)

## 📂 Project Structure

```
CVCheck/
├── src/
│   ├── App.vue                 # Main application component
│   ├── components/
│   │   ├── UploadZone.vue      # Drag & drop file upload interface
│   │   └── AnalysisResults.vue # Score visualization and results display
│   └── utils/
│       ├── pdfAnalyzer.js      # PDF text extraction and processing
│       ├── contentAnalyzer.js  # Section detection and content analysis
│       └── atsScorer.js        # Comprehensive scoring algorithm
├── public/
│   └── pdf.worker.min.mjs      # Local PDF.js worker for offline capability
└── index.html                  # Application entry point
```

## 🧠 Analysis Engine

The application uses a sophisticated analysis engine to evaluate CVs:

1.  **Text Extractability (25 pts)**: Verifies text can be parsed by machines (vs. image-based PDFs).
2.  **Section Detection (20 pts)**: Identifies critical sections (Contact, Experience, Education, Skills).
3.  **Formatting (20 pts)**: Checks page count, file size, and special character usage.
4.  **Contact Info (15 pts)**: Detects email, phone numbers, and LinkedIn profiles.
5.  **Content Quality (10 pts)**: Analyzes action verb usage and quantifiable achievements.
6.  **File Optimization (10 pts)**: Validates file size and metadata.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Seguleh/CVCheck.git
    cd CVCheck
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`

## 🔧 Troubleshooting

**PDF Upload Issues:**
If you encounter issues uploading PDFs, ensure the `pdf.worker.min.mjs` file is correctly located in the `public` directory. This project uses a local worker file to avoid CORS issues associated with CDN-hosted workers.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
