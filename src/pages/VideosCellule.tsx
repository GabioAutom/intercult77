import MainLayout from "@/components/layout/MainLayout";
import MediaGallery from "@/components/media/MediaGallery";

const VideosCellule = () => {
  return (
    <MainLayout pageTitle="Videos à La Cellule">
      <div className="max-w-5xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Videos à La Cellule</h2>
        <p className="text-lg leading-relaxed text-foreground mb-8">
          Découvrez les vidéos de nos événements à La Cellule.
        </p>
        <MediaGallery category="videos-cellule" />
      </div>
    </MainLayout>
  );
};

export default VideosCellule;
