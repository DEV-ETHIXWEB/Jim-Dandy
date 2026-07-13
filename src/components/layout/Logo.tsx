import logoImage from "@assets/logos/jim-dandy-logo.webp";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <a
      href="/"
      aria-label="Jim Dandy Sewer & Plumbing - Home"
      className={`group inline-block shrink-0 transition-transform duration-200 hover:scale-[1.02] ${className}`}
    >
      <img
        src={logoImage.src}
        width={logoImage.width}
        height={logoImage.height}
        alt="Jim Dandy Sewer & Plumbing"
        className="h-12 w-auto sm:h-14 lg:h-16"
      />
    </a>
  );
}
