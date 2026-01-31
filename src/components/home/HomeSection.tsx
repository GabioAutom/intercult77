import { Link } from "react-router-dom";

interface HomeSectionProps {
  title: string;
  verticalLabel: string;
  description: string;
  linkTo: string;
  linkText?: string;
  imageUrl: string;
  reverse?: boolean;
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
    <section className="flex flex-col md:flex-row gap-6 md:gap-12">
      {/* Image with vertical label */}
      <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0">
        <div 
          className="w-full h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Golden overlay */}
          <div className="absolute inset-0 bg-primary/70"></div>
          {/* Vertical label */}
          <span className="absolute top-8 right-4 text-primary-foreground font-light text-2xl md:text-3xl tracking-[0.3em] uppercase writing-vertical z-10">
            {verticalLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-4 md:py-8">
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
