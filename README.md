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

### Pdf
1- Script utilitaire pour calibrer les coordonnées (x,y) d'un template PDF.
Exécuter avec :  npx tsx .\src\scripts\pdf-calibrator.ts

2- Script pour tester le calibrage du pdf final
Exécuter avec :  npx tsx .\src\scripts\pdf_generate_test.ts

### Mail
NODEMAILER : me permet d'envoyer des mails au client depuis mon webhook en cas de paiement réussi.
Utilisation de gmail avec App Password :
https://nodemailer.com/usage/using-gmail
Pour tester l'envoi de mail :

> npx tsx .\src\scripts\test-mail.ts
> Stripe m'envoit un mail de notification de paiement réussi

### Stripe
Pour avoir les webhook de Stripe en local ouvrir un terminal et taper :
(Pour se connecter, tous les 90 jours, il faut taper : stripe login)
stripe listen --forward-to localhost:3000/api/webhook

## Tech Stack

Bootstrap 5.1.3
React 19
NextJs 15
Typescript
Neon (Postgres)
API Stripe 2025-08-27.basil avec intégration avancée : API Payment Element + l'interface utilisateur Elements
Mail : Nodemailer + API Gmail + Sanitaze-html
PDF : pdf-lib
Tests : Vitest + Github Workflow

Améliorations :

- StripeErrorBoundary -> le mettre à jour et l'utiliser
