import MainLayout from "@/components/layout/MainLayout";

const Lieux = () => {
  return (
    <MainLayout pageTitle="Lieux">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Nos Lieux</h2>
        <p className="text-lg leading-relaxed text-foreground">
          Découvrez les espaces où Intercult77 organise ses événements
          et activités culturelles à Bruxelles et au-delà.
        </p>
      </div>
    </MainLayout>
  );
};

export default Lieux;
