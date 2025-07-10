# Smart Lease Analyzer

A Next.js application that analyzes rental agreements using AI. Upload a PDF lease agreement and get an AI-powered analysis of key clauses, terms, and potential red flags.

## Features

- 📄 PDF upload and text extraction
- 🤖 AI-powered lease analysis using GPT-4
- 📊 Structured analysis of key lease terms
- ⚠️ Red flag detection and risk assessment
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
│   ├── openai.ts                 # OpenAI API integration
│   └── pdfParser.ts              # PDF text extraction
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## How It Works

1. **File Upload**: Users upload a PDF lease agreement through the UploadThing interface
2. **Text Extraction**: The PDF is processed using `pdf-parse` to extract raw text
3. **AI Analysis**: The extracted text is sent to OpenAI GPT-4 with a structured prompt
4. **Results Display**: The AI response is formatted and displayed in a clean, organized layout

## Analysis Categories

The AI analyzes the following aspects of the lease agreement:

- **Parties Involved**: Landlord and tenant information
- **Lease Duration**: Start date, end date, and renewal terms
- **Rent & Payment Terms**: Monthly rent, due dates, late fees
- **Termination Clause**: Early termination conditions and notice requirements
- **Security Deposit**: Amount, return conditions, deductions
- **Risks & Red Flags**: Concerning clauses and potential issues

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team. 