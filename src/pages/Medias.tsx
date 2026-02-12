import MainLayout from "@/components/layout/MainLayout";
import MediaGallery from "@/components/media/MediaGallery";

const Medias = () => {
  return (
    <MainLayout pageTitle="Médias">
      <div className="max-w-5xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Médias</h2>
        <p className="text-lg leading-relaxed text-foreground mb-8">
          Photos, vidéos et articles de presse sur nos événements
          et activités culturelles.
        </p>
        <MediaGallery />
      </div>
    </MainLayout>
  );
};

export default Medias;
