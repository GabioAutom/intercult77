import MainLayout from "@/components/layout/MainLayout";
import MediaAdmin from "@/components/media/MediaAdmin";

const MediasAdmin = () => {
  return (
    <MainLayout pageTitle="Admin Médias">
      <div className="max-w-4xl">
        <MediaAdmin />
      </div>
    </MainLayout>
  );
};

export default MediasAdmin;
