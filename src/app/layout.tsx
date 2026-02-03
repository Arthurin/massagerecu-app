import { Metadata } from "next";
import { bellefair, roboto } from "@/styles/fonts";
import "@/styles/tailwind.css";
import "@/styles/styles.scss";
import BootstrapClient from "@/components/features/BootstrapClient";
import BootstrapNavbarBehavior from "@/components/features/BootstrapNavbarBehavior";
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
      <body
        id="page-top"
        className={`antialiased ${bellefair.variable} ${roboto.variable}`}
      >
        {/* Header */}
        <Header />
        {/* Charge Bootstrap */}
        <BootstrapClient />
        {/* Charge les scripts pour réduire la taille du heeder et referme la barre de navigation lorsqu'il y a un menu déroulant qui reçoit un clic*/}
        <BootstrapNavbarBehavior />

        {children}

        {/* Footer */}
        <Footer />

        <BootstrapClient />
      </body>
    </html>
  );
}
