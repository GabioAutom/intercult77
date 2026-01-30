import MainLayout from "@/components/layout/MainLayout";

const Medias = () => {
  return (
    <MainLayout pageTitle="Médias">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Médias</h2>
        <p className="text-lg leading-relaxed text-foreground">
          Photos, vidéos et articles de presse sur nos événements
          et activités culturelles.
        </p>
      </div>
    </MainLayout>
  );
};

export default Medias;
