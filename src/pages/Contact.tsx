import MainLayout from "@/components/layout/MainLayout";

const Contact = () => {
  return (
    <MainLayout pageTitle="Contact">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold text-primary mb-6">Contactez-nous</h2>
        <div className="space-y-4 text-lg text-foreground">
          <p>
            <strong>Adresse:</strong><br />
            Av. Ducpétiaux 133A, 1060 Bruxelles
          </p>
          <p>
            <strong>Téléphone:</strong><br />
            +32 474 44 30 07
          </p>
          <p>
            <strong>Email:</strong><br />
            info@intercult77.be
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
