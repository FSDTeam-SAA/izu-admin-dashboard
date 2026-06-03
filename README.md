# Workyapa Admin Dashboard

Admin panel for the Workyapa marketplace, built with **Next.js 16 (App Router)**,
**NextAuth v5**, **TanStack Query**, **Axios**, **shadcn/ui** + **Tailwind CSS v4**,
**Recharts**, and **Sonner** toasts.

## Features

- 🔐 **Authentication** — NextAuth (Auth.js v5) Credentials provider against the
  backend `/auth/login`. Access token is stored in the JWT session and attached to
  every request via an Axios interceptor. Admin-only access is enforced.
- 🛡️ **Route protection** — `proxy.ts` (Next.js 16's renamed middleware) redirects
  guests to `/login` and signed-in users away from auth pages.
- 🔁 **Password recovery** — Forgot password → OTP verification → reset flow.
- 📊 **Dashboard** — stat cards, revenue area chart, recent activity, and a
  top-performing-services donut, each with its own time/year filter.
- 📋 **Lists** — Users, Providers, and Commission Reports with server pagination
  and skeleton loading.
- ⚙️ **Settings** — edit profile (with avatar upload) and change password.
- 📱 **Responsive** — works across desktop, tablet, and mobile (collapsible sidebar).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Environment (`.env`)

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5008/api/v1
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
```

The backend (`../backend_izu`) must be running and reachable at
`NEXT_PUBLIC_BASE_URL`. Log in with an account whose `accountType` is `admin`.

## Project structure

```
app/
  (auth)/            login, forgot-password, verify-otp, reset-password
  (admin)/           dashboard, users, providers, commission-reports, settings
  api/auth/[...nextauth]/route.ts
  layout.tsx, providers.tsx, globals.css
auth.ts              NextAuth configuration
proxy.ts             route protection (Next.js 16 middleware convention)
lib/
  api.ts             all API call functions
  axios.ts           axios instance + token interceptor
  types.ts, utils.ts, nav.ts
components/
  ui/                shadcn primitives
  layout/            sidebar, header, dashboard shell
  dashboard/, list/, settings/
types/next-auth.d.ts session/JWT type augmentation
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
