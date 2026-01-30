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
      {/* Mobile Header */}
      <header className="md:hidden bg-primary p-4">
        <Link to="/" className="block text-center">
          <h1 className="text-2xl font-light text-primary-foreground tracking-wide">
            intercult<span className="font-bold">77</span>
          </h1>
        </Link>
        {/* Mobile Navigation */}
        <nav className="mt-4 overflow-x-auto">
          <ul className="flex gap-4 justify-center flex-wrap">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`text-xs font-medium tracking-wider uppercase ${
                    location.pathname === item.href
                      ? "text-primary-foreground underline underline-offset-4"
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Page Title */}
      <div className="md:hidden bg-primary py-3 px-4">
        <h2 className="text-xl font-light tracking-widest text-primary-foreground uppercase text-center">
          {pageTitle}
        </h2>
      </div>

      {/* Desktop Header Row: Logo + Navigation */}
      <header className="hidden md:flex">
        {/* Logo Area */}
        <div className="w-72 lg:w-80 flex-shrink-0 h-40 flex items-end justify-center pb-4 bg-primary">
          <Link to="/" className="block">
            <h1 className="text-3xl font-light text-primary-foreground tracking-wide">
              intercult<span className="font-bold">77</span>
            </h1>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 h-40 flex items-end pb-4 px-12">
          <ul className="flex flex-wrap gap-6 lg:gap-8">
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
        {/* Left Column: Gap + Page Title Vertical - Desktop only */}
        <div className="hidden md:flex md:flex-col w-72 lg:w-80 flex-shrink-0">
          {/* White gap between logo and title - matches content top padding */}
          <div className="h-12 bg-background"></div>
          {/* Title area */}
          <div className="flex-1 flex items-center justify-center bg-primary">
            <span className="page-title-vertical">{pageTitle}</span>
          </div>
        </div>

        {/* Right Column: Content - top padding matches the gap */}
        <main className="flex-1 px-6 md:px-12 lg:px-16 pt-12 pb-8 md:pb-12 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-footer py-8 px-6 md:px-12">
        <div className="md:ml-72 lg:ml-80">
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
