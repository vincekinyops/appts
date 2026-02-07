This is a web app for CSDP scheduling, communication tracking, and reporting.

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure Supabase

Create a Supabase project, then run the SQL in `docs/supabase.sql` in the SQL editor.

Set the environment variables:

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3) Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Notes

- The SQL file enables permissive policies for quick setup. Review and lock down policies for production use.
