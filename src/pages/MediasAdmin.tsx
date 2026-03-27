import MainLayout from "@/components/layout/MainLayout";
import GalleryAdminComponent from "@/components/gallery/GalleryAdmin";

const MediasAdmin = () => {
  return (
    <MainLayout pageTitle="Admin Médias">
      <div className="max-w-5xl space-y-12">
        <GalleryAdminComponent galleryType="medias" galleryLabel="Médias" />
        <hr className="border-border" />
        <GalleryAdminComponent galleryType="videos-cellule" galleryLabel="Videos à La Cellule" />
      </div>
    </MainLayout>
  );
};

export default MediasAdmin;
