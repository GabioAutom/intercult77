import MainLayout from "@/components/layout/MainLayout";

const Liens = () => {
  return (
    <MainLayout pageTitle="Liens">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Liens Utiles</h2>
        <p className="text-lg leading-relaxed text-foreground">
          Découvrez nos partenaires et ressources culturelles.
        </p>
      </div>
    </MainLayout>
  );
};

export default Liens;
