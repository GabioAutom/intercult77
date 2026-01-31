import { Link } from "react-router-dom";

interface HomeSectionProps {
  title: string;
  verticalLabel: string;
  description: string;
  linkTo: string;
  linkText?: string;
  imageUrl: string;
}

const HomeSection = ({
  title,
  verticalLabel,
  description,
  linkTo,
  linkText = "En savoir plus",
  imageUrl,
}: HomeSectionProps) => {
  return (
    <section className="flex flex-col md:flex-row">
      {/* Image with vertical label - matching the title column style */}
      <div className="w-full md:w-72 lg:w-80 flex-shrink-0">
        <div 
          className="w-full h-64 md:h-72 lg:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Golden overlay - same as title column */}
          <div className="absolute inset-0 bg-primary/80"></div>
          {/* Vertical label - same style as page title */}
          <span className="page-title-vertical absolute top-8 right-4 z-10 text-3xl md:text-4xl lg:text-5xl">
            {verticalLabel}
          </span>
        </div>
      </div>

      {/* Content - matching the content area spacing */}
      <div className="flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
          {title}
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">
          {description}
        </p>
        <Link 
          to={linkTo}
          className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
};

export default HomeSection;
