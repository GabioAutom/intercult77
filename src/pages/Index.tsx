import MainLayout from "@/components/layout/MainLayout";
import HomeSection from "@/components/home/HomeSection";

// Placeholder images - these can be replaced with actual images
const sections = [
  {
    title: "À propos de nous",
    verticalLabel: "À PROPOS",
    description: "Intercult77 est une plateforme culturelle basée à Bruxelles qui célèbre la diversité artistique et les échanges interculturels. Fondée et dirigée par Dario Altamirano, un artiste multidisciplinaire avec plus de 30 ans d'expérience dans les arts et la culture…",
    linkTo: "/a-propos",
    imageUrl: "https://intercult77.org/new/wp-content/uploads/2025/05/a-propos-home.webp",
  },
  {
    title: "Notre mission",
    verticalLabel: "MISSION",
    description: "Intercult77 se spécialise dans :\n\nLa programmation et la gestion culturelle : Nous concevons des événements artistiques variés, notamment des concerts, spectacles de danse, expositions et ateliers.",
    linkTo: "/activites",
    imageUrl: "https://intercult77.org/new/wp-content/uploads/2025/05/mission-home.webp",
  },
  {
    title: "Événements",
    verticalLabel: "ÉVÉNEMENTS",
    description: "Intercult77 organise des événements culturels variés : théâtre, musique ou exposition.\nPour rester informé(e) de nos prochaines activités et de toutes nos nouveautés, visitez notre agenda régulièrement !",
    linkTo: "/activites",
    imageUrl: "https://intercult77.org/new/wp-content/uploads/2025/05/events-home-1.webp",
  },
  {
    title: "Médias",
    verticalLabel: "MÉDIAS",
    description: "Revisitez moments marquants, rencontres artistiques et spectacles inoubliables dans notre galerie médias.",
    linkTo: "/medias",
    imageUrl: "https://intercult77.org/new/wp-content/uploads/2025/05/mrdias-home.webp",
  },
  {
    title: "Contact",
    verticalLabel: "CONTACT",
    description: "Envoyez-nous un courriel, et nous vous répondrons dans les plus brefs délais.",
    linkTo: "/contact",
    imageUrl: "https://intercult77.org/new/wp-content/uploads/2025/05/contact-home.webp",
  },
];

const Index = () => {
  return (
    <MainLayout pageTitle="Accueil">
      <div className="space-y-12 md:space-y-16">
        {sections.map((section, index) => (
          <HomeSection
            key={index}
            title={section.title}
            verticalLabel={section.verticalLabel}
            description={section.description}
            linkTo={section.linkTo}
            imageUrl={section.imageUrl}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default Index;
