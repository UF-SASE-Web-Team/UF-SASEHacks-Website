# UF SASE Hacks Website

Registration and information website for UF SASE Hacks hackathon.

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/UF-SASE-Web-Team/UF-SASEHacks-Website.git
   cd UF-SASEHacks-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NOTION_API_KEY=your_notion_api_key
   NOTION_DB_ID=your_notion_database_id
   ```

4. **Set up the database**

   Run the SQL migration in your Supabase SQL Editor:
   - See `SETUP_INSTRUCTIONS.md` for database setup
   - Or use the Supabase dashboard to create the required tables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Validation**: Zod + React Hook Form
- **FAQ Management**: Notion API

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── portal/            # User portal & registration
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Auth components
│   ├── forms/            # Form components
│   ├── resume/           # Resume components
│   └── sections/         # Landing page sections
└── lib/                  # Utilities and configs
    ├── supabase/         # Supabase client setup
    ├── constants.ts      # App constants
    ├── notion.ts         # Notion integration
    └── validation.ts     # Zod schemas
```

## Contributing

When working on the landing page sections, each section is now in a separate file under `src/components/sections/` to avoid merge conflicts. Work on your assigned section file independently.