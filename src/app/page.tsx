// app/page.tsx
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <>
      <header className="masthead">
        <div className="container-lg">
          <Image
            src="/assets/img/logo.png"
            alt="Logo de Massage Reçu"
            id="mastheadLogo"
            width={320}
            height={320}
            quality={90}
            priority
            placeholder="blur"
            blurDataURL="/assets/img/logo.png?w=16&blur=20"
          />
          <h1 className="masthead-heading">
            Vos soins massages dans le secteur de Janzé-Rennes
          </h1>
          <div className="masthead-subheading">
            Venez vous évader à travers un voyage immobile.
          </div>
        </div>
      </header>
      {/* Services */}
      <section id="services" className="page-section bg-light">
        <div className="container text-center">
          <h2 className="section-heading text-uppercase">Bienvenue</h2>
          <div className="row text-center">
            <p>
              À votre écoute pour vous apporter un massage en profondeur adapté
              à vos besoins.
            </p>
            <p>
              Je vous accueille dans un espace calme et intimiste dédié au
              bien-être pour vous reconnecter à votre corps.
            </p>
            <p>
              Soyez acteur de votre bien-être, retrouvez une détente musculaire
              et apaisez le mental grâce au massage.
            </p>
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section id="news" className="page-section">
        <div className="container text-center">
          <h2 className="section-heading text-uppercase">Actualités</h2>
          <h3 className="section-subheading text-muted">
            Restez informé·e grâce à la newsletter ou aux réseaux sociaux{" "}
            <span className="no-wrap">
              {"("}
              <a
                className="link-secondary"
                href="https://fb.me/MassageRecu"
                target="_blank"
                aria-label="Facebook"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              et{" "}
              <a
                className="link-secondary"
                href="https://www.instagram.com/massage_recu/"
                target="_blank"
                aria-label="Instagram"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              ).
            </span>
          </h3>
          <div className="text-center">
            <h3>Fermeture estivale 2025</h3>
            <p>
              Je serais fermé du 26 juillet au 6 août, ainsi que du 26 août au
              18 septembre. <br />
              Bel été à vous 🌞
            </p>
          </div>
          <div className="text-center">
            <h3>
              29/30/31 Mai 2025 - Trois jours de massages dans le cadre du
              festival Balilas !
            </h3>
            <p>
              Venez me retrouver au marché de créateurs·trices du festival
              Balilas, près du Gentieg à Janzé.
            </p>
          </div>
          <div className="text-center">
            <h3>Une petite surprise spéciale St Valentin !</h3>
            <p>
              J'ai le plaisir d'inviter Marie, une super masseuse, pour une
              collaboration sur 3 jours : le vendredi 14, le samedi 15 et le
              lundi 17 février.
              <br /> Profitez de l'occasion pour vous faire masser en duo ou
              bien pour découvrir le massage à 4 mains 🥰.
            </p>
          </div>
          <div className="text-center">
            <h3>Fermeture du cabinet à St-Jacques de la Lande</h3>
            <p>
              À compter du 1er décembre 2024, je reçois uniquement à Brie ! En
              effet, je ne propose plus les massages à St-Jacques de la Lande
              (sauf exception pour les cartes cadeaux en cours). <br />
              J'espère que les Rennais·e·s ont apprécié ce service et que cela
              leur donnera envie de me retrouver à Brie 😁.
            </p>
          </div>
        </div>
      </section>
      {/* Video Section */}
      <section id="services" className="page-section bg-light">
        <div className="container text-center">
          <h2 className="section-heading text-uppercase">
            Le cabinet en vidéo
          </h2>
          <div className="row justify-content-center">
            <div className="col col-lg-8">
              <div className="video-container">
                <video controls>
                  <source
                    src="https://artgeek.alwaysdata.net/video/video_intro.mp4"
                    type="video/mp4"
                  />
                  <source
                    src="https://artgeek.alwaysdata.net/video/video_intro.webm"
                    type="video/webm"
                  />
                  Votre navigateur ne reconnait aucun des formats vidéo
                  disponibles.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About */}
      <section id="about" className="page-section">
        <div className="container text-center">
          <h2 className="section-heading text-uppercase">À propos</h2>
          <h3 className="section-subheading text-muted">
            Mon parcours en quelques lignes
          </h3>
          <div className="row">
            <div className="col-lg-4">
              <div className="team-member">
                <Image
                  src="/assets/img/profil.webp"
                  alt="photo de profil"
                  className="rounded-circle"
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className="col-lg-8 text-justify">
              <p>Je m'appelle Arthur Frin et je suis originaire de Vitré.</p>
              <p>
                J'ai commencé à masser très jeune, tout d'abord avec ma sœur
                lors des longs trajets en voiture, puis avec des ami·e·s qui
                partagent cette passion avec moi. Les choses sérieuses
                commencent lorsque je me forme sur une dizaine de massages
                bien-être pour améliorer ma technique. En 2022, je suis diplômé
                en qualité d'intervenant spa et bien-être. J'emménage dans la
                foulée à Brie, porté par un projet d'habitat partagé, dans un
                lieu magnifique à la campagne, idéal pour ouvrir mon cabinet.
              </p>
              <p>
                Je considère le massage comme un moyen simple et efficace pour
                se sentir bien dans son corps et dans son esprit. J'ai choisi de
                vous proposer dans ma carte de prestations uniquement les
                massages les plus populaires dans différents styles de massage :
                du moment cocooning au massage dynamique, avec une huile de
                massages ou bien en tenue habillé.
              </p>
              <p>J'espère que vous apprécierez votre soin en ma compagnie.</p>
              <p>Au plaisir de vous rencontrer,</p>
              <p>Arthur</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
