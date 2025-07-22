# Smart Lease Analyzer

A Next.js application that provides comprehensive legal analysis of rental agreements using AI. Upload a PDF lease agreement and get detailed factual extraction, risk assessment, and actionable legal advice with suggested improvements.

## Features

- 📄 PDF upload and text extraction via UploadThing
- 🤖 AI-powered lease analysis using GPT-4-turbo
- 📊 Structured factual information extraction
- ⚖️ Legal advice and risk assessment
- 📝 Missing clause detection and suggestions
- ⚠️ Risky clause identification
- 💡 Suggested clause drafts
- 📚 Legal references and citations
- 🎨 Clean, modern UI with Tailwind CSS
- ☁️ Ready for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: UploadThing
- **PDF Processing**: pdf-parse
- **AI Analysis**: OpenAI GPT-4-turbo
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- UploadThing account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-lease-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here
```

4. Set up UploadThing:
   - Go to [uploadthing.com](https://uploadthing.com)
   - Create a new project
   - Copy your API keys to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
smart-lease-analyzer/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # API route for lease analysis
│   │   └── uploadthing/
│   │       ├── core.ts           # UploadThing configuration
│   │       └── route.ts          # UploadThing API route
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── UploadBox.tsx             # File upload component
│   └── ResultBox.tsx             # Analysis results display
├── lib/
│   ├── types/
│   │   └── lease.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── prompts.ts            # AI prompt utilities
│   ├── openai.ts                 # OpenAI API integration
│   └── pdfParser.ts              # PDF text extraction
├── types/
│   └── pdf-parse.d.ts            # Type declarations
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## How It Works

1. **File Upload**: Users upload a PDF lease agreement through the UploadThing interface
2. **Text Extraction**: The PDF is processed using `pdf-parse` to extract raw text
3. **AI Analysis**: The extracted text is sent to OpenAI GPT-4 with structured prompts
4. **Comprehensive Analysis**: The AI provides both factual extraction and legal advice
5. **Results Display**: The analysis is formatted and displayed in an organized layout

## Analysis Categories

The AI analyzes the following aspects of the lease agreement:

### 📋 Key Facts
- **Parties Involved**: Landlord and tenant information
- **Rent & Payment Terms**: Monthly rent, due dates, payment methods
- **Security Deposit**: Amount and return conditions

### 💼 Legal Advice
- **Missing Clauses**: Important clauses that are not present in the agreement
- **Risky Clauses**: Clauses that pose legal risks or are unfavorable
- **Suggested Clauses**: Draft text for missing or improved clauses
- **Legal References**: Relevant legal acts, judgments, and citations

## Code Architecture

### Modular Design
The application follows a clean, modular architecture:

- **`lib/types/lease.ts`**: TypeScript interfaces for type safety
- **`lib/utils/prompts.ts`**: AI prompt management and response parsing
- **`lib/openai.ts`**: Clean OpenAI integration with focused responsibilities
- **`lib/pdfParser.ts`**: PDF text extraction with error handling

### Key Features
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Graceful fallbacks for parsing and API failures
- **Modular Prompts**: Structured, maintainable AI prompts
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `OPENAI_API_KEY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

## API Endpoints

### POST `/api/analyze`
Analyzes a lease agreement from a file URL.

**Request Body:**
```json
{
  "fileUrl": "https://utfs.io/f/..."
}
```

**Response:**
```json
{
  "facts": {
    "partiesInvolved": "...",
    "rentAndPaymentTerms": { ... },
    "securityDeposit": { ... }
  },
  "advice": {
    "missingClauses": [...],
    "riskyClauses": [...],
    "suggestedClauses": [...],
    "legalReferences": [...]
  }
}
```

### POST `/api/uploadthing`
Handles file uploads via UploadThing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team. 