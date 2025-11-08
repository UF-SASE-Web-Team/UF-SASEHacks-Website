# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 hackathon registration and management website for UF SASE Hacks. It uses the App Router with TypeScript, Supabase for authentication and database, Notion API for FAQ management, and Tailwind CSS for styling.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (uses Turbopack)
npm run dev

# Build for production (uses Turbopack)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NOTION_API_KEY` - Notion API key for FAQ integration
- `NOTION_DB_ID` - Notion database ID for FAQ content

## Architecture

### Authentication & Authorization

- Uses Supabase Auth with SSR support
- **Two separate Supabase clients** with different use cases:
  - `createSupabaseBrowserClient()` (from `@/lib/supabase/client`) - Client-side only ("use client" components)
  - `createSupabaseServerClient()` (from `@/lib/supabase/server`) - Server components and API routes
- Admin authorization uses Supabase RPC function `is_admin(p_uid)` which must be defined in the database

### Database Schema

Two main tables with a 1:1 relationship:
- **profiles** - User profile data (personal info, demographics, preferences)
  - Primary key: `id` (matches Supabase auth user ID)
  - Contains: name, email, school, major, address, t-shirt size, dietary restrictions, demographics
- **registrations** - Registration metadata and status
  - Foreign key: `user_id` references profiles(id)
  - Contains: `status` (pending/confirmed/waitlist/rejected), `editing_locked`, `resume_url`, consent flags
  - The `editing_locked` boolean prevents users from editing their profile/registration after submission

### User Flow

1. **Login** (`/login`) - Supabase magic link authentication
2. **Onboarding** (`/portal/onboarding`) - First-time registration form
   - Displays if profile is incomplete (missing `full_name` or `school`)
   - Single comprehensive form combining profile data, resume upload, and consent checkboxes
   - Uses server actions: `upsertProfile`, `saveRegistrationFlags`, `uploadResumeOnboarding`
3. **Portal** (`/portal`) - User dashboard after onboarding
   - Redirects to onboarding if profile incomplete
   - Shows registration status and links to edit profile/resume
   - Uses `ensureRows()` action to create database rows if missing
4. **Profile Edit** (`/portal/profile`) - Update profile after registration
5. **Resume Management** (`/portal/resume`) - Upload/replace resume

### Server Actions Pattern

Server actions are colocated with routes in `actions.ts` files:
- `/app/portal/actions.ts` - Profile management: `upsertProfile`, `ensureRows`, `saveRegistrationFlags`, `uploadResumeOnboarding`
- `/app/portal/resume/actions.ts` - Resume operations
- `/app/admin/actions.ts` - Admin operations: `fetchAdminRows`, `setStatus`, `toggleLock`, `getSignedResumeLinks`

All server actions use `createSupabaseServerClient()` and follow the pattern of returning `{ ok: boolean, error?: string }` for consistent error handling.

### Admin Features

- **Admin Console** (`/admin`) - Search and filter registrations, view user details
  - Server-side search/filter by name, email, or status
  - Links to individual user detail pages
- **User Details** (`/admin/[userId]`) - View and update individual registration status/lock state
- **CSV Export** (`/api/export`) - Download all registrations as CSV
- **Bulk Resume Download** - Uses `DownloadAllResumes` component to fetch and zip all resumes

### Form Validation

- Uses `react-hook-form` with `zod` schemas from `@/lib/validation.ts`
- Main schemas:
  - `profileSchema` - Personal info, education, address, preferences, demographics
  - `registrationFlagsSchema` - Consent checkboxes with required validation
- All form options (t-shirt sizes, dietary restrictions, etc.) defined as const arrays in validation file

### Landing Page Structure

Landing page sections are split into separate component files under `src/components/sections/` to avoid merge conflicts during parallel development. Each team member can work on their assigned section independently.

### Notion Integration

FAQs are managed via Notion database:
- `fetchFaqFromNotion()` in `@/lib/notion.ts` queries Notion database
- Filters for `published: true` checkbox, sorts by `order` number
- Converts Notion rich text (including links) to markdown format
- API route `/api/faq` exposes FAQ data for client-side fetching

## TypeScript Configuration

- Path alias: `@/*` maps to `src/*`
- Strict mode enabled
- Target: ES2022, Lib: ES2023
- No `.js` files allowed (`allowJs: false`)

## Important Notes

- **Server vs Client Supabase**: Always use the correct Supabase client for the context
- **Row initialization**: Portal uses `ensureRows()` to create profiles/registrations if they don't exist yet
- **Resume storage**: Resumes are stored in Supabase Storage with URLs saved in the registrations table
  - Path format: `{user_id}/resume.pdf` (one per user, uses `upsert: true` to replace)
  - Security: PDF files validated by magic number (`%PDF-`) and MIME type
  - Max size: 10 MB
  - Storage bucket: `resumes` (private, with RLS policies)
- **Admin check**: All admin routes/API endpoints must verify `is_admin()` RPC call
- **Editing lock**: When `editing_locked` is true, users can view but not modify their data
- **Middleware**: Session refresh happens on every request except `/api/faq`, `_next/static`, `_next/image`, and `favicon.ico` (see middleware matcher config)
