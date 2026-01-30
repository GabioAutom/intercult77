import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const navigation = [
  { name: "ACCUEIL", href: "/" },
  { name: "À PROPOS", href: "/a-propos" },
  { name: "ACTIVITÉS", href: "/activites" },
  { name: "LIEUX", href: "/lieux" },
  { name: "MÉDIAS", href: "/medias" },
  { name: "LIENS", href: "/liens" },
  { name: "CONTACT", href: "/contact" },
];

const MainLayout = ({ children, pageTitle }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Row: Logo + Navigation */}
      <header className="flex">
        {/* Logo Area */}
        <div className="w-64 md:w-72 lg:w-80 flex-shrink-0 h-32 md:h-40 flex items-end justify-center pb-4 bg-primary">
          <Link to="/" className="block">
            <h1 className="text-2xl md:text-3xl font-light text-primary-foreground tracking-wide">
              intercult<span className="font-bold">77</span>
            </h1>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 h-32 md:h-40 flex items-end pb-4 px-8 md:px-12">
          <ul className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={
                    location.pathname === item.href
                      ? "nav-link-active"
                      : "nav-link"
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Column: Page Title Vertical */}
        <div className="w-64 md:w-72 lg:w-80 flex-shrink-0 flex items-center justify-center bg-primary">
          <span className="page-title-vertical">{pageTitle}</span>
        </div>

        {/* Right Column: Content */}
        <main className="flex-1 content-area py-8 md:py-12 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-footer py-8 px-8 md:px-12">
        <div className="max-w-4xl ml-64 md:ml-72 lg:ml-80">
          <div className="text-footer-foreground">
            <p className="font-semibold">
              Intercult 77 <span className="font-normal">ASBL</span>
            </p>
            <p className="mt-1">Av. Ducpétiaux 133A, 1060 Bruxelles</p>
            <p className="mt-1 text-footer-foreground font-medium">+32 474 44 30 07</p>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-footer-foreground hover:opacity-70 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-footer-foreground hover:opacity-70 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="text-footer-foreground hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
