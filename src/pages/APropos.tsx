import MainLayout from "@/components/layout/MainLayout";

const APropos = () => {
  return (
    <MainLayout pageTitle="À Propos">
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-foreground">
          <strong className="text-primary">Intercult77</strong> est une plateforme culturelle basée
          à Bruxelles qui célèbre la diversité artistique
          et les échanges interculturels.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          Fondée et dirigée par Dario Altamirano,
          un artiste multidisciplinaire avec plus
          de 30 ans d'expérience dans les arts et la culture,
          Intercult77 agit comme un catalyseur
          de rencontres entre artistes,
          publics et communautés.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          Nous croyons au pouvoir de la culture
          pour connecter les individus et bâtir
          des ponts entre les cultures.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          Notre mission est de promouvoir la créativité sous
          toutes ses formes, en offrant un espace
          où les talents locaux et internationaux
          peuvent se réunir, collaborer et s'exprimer.
        </p>
      </div>
    </MainLayout>
  );
};

export default APropos;
