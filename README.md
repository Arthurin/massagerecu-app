## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Pour tester l'envoi de mail : > npx tsx .\src\scripts\test-mail.ts
Stripe m'envoit un mail de notification de paiement réussi, le mail au client est géré avec Nodmailer.

Pour avoir les webhook de Stripe en local ouvrir un terminal et taper :
(Pour se connecter, tous les 90 jours, il faut taper : stripe login)
stripe listen --forward-to localhost:3000/api/webhook

## Tech Stack

React 19
NextJs 15
Typescript
API Stripe 2025-08-27.basil
Mail : Nodemailer + API Gmail + Sanitaze-html
PDF : pdf-lib
Tests : Vitest + Github Workflow

Améliorations :

- StripeErrorBoundary -> le mettre à jour et l'utiliser
