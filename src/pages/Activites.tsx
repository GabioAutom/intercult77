import MainLayout from "@/components/layout/MainLayout";

const Activites = () => {
  return (
    <MainLayout pageTitle="Activités">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Nos Activités</h2>
        <p className="text-lg leading-relaxed text-foreground">
          Intercult77 organise régulièrement des événements culturels,
          des expositions, des concerts et des ateliers créatifs.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          Nous collaborons avec des artistes locaux et internationaux
          pour créer des expériences uniques et enrichissantes.
        </p>
      </div>
    </MainLayout>
  );
};

export default Activites;
