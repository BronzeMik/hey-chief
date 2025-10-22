import { Button } from "./ui/button"

interface CategoryHeroProps {
  title: string
  description: string
  backgroundImage: string
  mobileBackgroundImage?: string
}

export function CategoryHero({
  title,
  description,
  backgroundImage,
  mobileBackgroundImage,
}: CategoryHeroProps) {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Mobile background */}
        {mobileBackgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${mobileBackgroundImage})` }}
          />
        )}

        {/* Desktop background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{title}</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">{description}</p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          SHOP NOW
        </Button>
      </div>
    </section>
  )
}
