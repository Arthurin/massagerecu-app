import "@/styles/styles.scss";
import { Metadata } from "next";
import Script from "next/script";
import BootstrapClient from "@/components/BootstrapClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Disable automatic addition of CSS

export const metadata: Metadata = {
  title: {
    template: "%s | Massage Reçu",
    default: "Massage Reçu",
  },
  description:
    "Masseur professionnel installé à Janzé et à Rennes. Offrez (vous) le bon cadeau, un massage bien être ! Un large choix est proposé, allant du massage cocooning au massage dynamique, avec huile de massage ou en tenue habillé. Massage Indien, Balinais, Thaïlandais, Shiatsu, Réflexologie...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body id="page-top" className={`antialiased`}>
        {/* Header */}
        <Header />

        {children}

        {/* Footer */}
        <Footer />

        {/* Charge les scripts */}
        <BootstrapClient />
        <Script
          src="/js/scripts.js"
          strategy="lazyOnload" // Charge après que la page soit complètement chargée
        />
      </body>
    </html>
  );
}
