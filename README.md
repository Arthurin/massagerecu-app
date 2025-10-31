Pour avoir les webhook de Stripe en local ouvrir un terminal et taper :
stripe listen --forward-to localhost:3000/api/webhook

StripeErrorBoundary : le mettre à jour et l'utiliser

Arborescence du projet :
src/
├─ app/
│ ├─ api/
│ │ └─ webhook/
│ │ └─ route.ts
│ ├─ checkout/
│ └─ complete/
├─ lib/
│ ├─ stripe.ts
│ └─ mailer.ts
└─ lib/
│ └─ mailer.ts

Pour tester l'envoi de mail : > npx tsx .\src\script\test-mail.ts

## Tech Stack

React 19
NextJs 15
Typescript
Paiement : API Stripe
Mail : Nodemailer + API Gmail + Sanitaze-html
PDF : pdf-lib
Tests : Vitest + Github Workflow

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
