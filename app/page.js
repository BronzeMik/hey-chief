import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Button } from "@/components/ui/button";
import CustomizeHatCTA from "@/components/customize-hat-cta";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <CustomizeHatCTA />
        <ProductGrid
          collectionHandle="sports-hats"
          title="Featured Hats"
          start={0}
          end={4}
        />
        <div className="flex flex-col md:flex-row justify-between">
          <img
            src={"/fast_shipping.png"}
            alt="Hey Chief Founder"
            className="w-[100%] md:w-[60%]"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Inspired by Legacy
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Fast. Hassle-Free. Straight to Your Door.
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground">
              Honor tradition without the wait. Every “Hey Chief” order ships
              quickly and securely, arriving in premium packaging that’s ready
              to gift or wear with pride. Service, legacy, and convenience—all
              in one box.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="/products"
                className="inline-flex items-center rounded-2xl px-6 py-3 text-base font-semibold shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-primary text-primary-foreground cursor-pointer"
              >
                Shop Now
              </a>
              <a
                href="/about"
                className="inline-flex items-center rounded-2xl px-6 py-3 text-base font-medium transition hover:underline text-primary cursor-pointer"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
        <ProductGrid
          collectionHandle="sports-hats"
          title="Limited Edition Design"
          start={4}
          end={8}
        />
        <div
          style={{ backgroundImage: "url('/chief-petty-officer-hats.png')" }}
          className="w-full h-[500px] hidden md:flex justify-end py-8 px-7"
        >
          <div className="w-[30%] bg-white rounded-lg py-4 px-4 text-center flex flex-col justify-center items-center">
            <div className="relative inline-block leading-tight">
              <span className="absolute inset-0 text-[clamp(1.5rem,3.7vw,2.1rem)] font-black uppercase tracking-tight text-gray-600 translate-y-[1px] translate-x-[1px] opacity-80 select-none">
                Uncompromising Integrity Is My Standard
              </span>
              <h1 className="relative text-[clamp(1.5rem,3.7vw,2.1rem)] font-black uppercase tracking-tight text-[#d1460d]">
                Uncompromising Integrity Is My Standard
              </h1>
            </div>

            <p className="my-5">
              For a Chief Petty Officer, integrity is not optional—it is the bedrock of leadership and service. It means living by the highest moral compass, upholding traditions, and setting the example for all who follow. This standard is more than words; it reflects a lifetime of discipline, accountability, and pride in the uniform. By embodying uncompromising integrity, every Chief carries forward the Navy&apos;s legacy of honor, courage, and commitment.
            </p>
            <a href="/products">
            <Button className="w-[80%] bg-[#d1460d] text-white">Shop</Button>
            </a>
          </div>
        </div>
        <div
          style={{
            backgroundImage: "url('/chief-petty-officer-hats-mobile.png')",
          }}
          className="relative w-full h-[250px] md:hidden px-3"
        >
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 bg-white rounded-lg py-4 px-4 text-center flex flex-col justify-center items-center w-[90vw] border-2 border-slate-200">
            <div className="relative inline-block leading-tight">
              <span className="absolute inset-0 text-[clamp(1.5rem,3.7vw,2.1rem)] font-black uppercase tracking-tight text-gray-600 translate-y-[1px] translate-x-[1px] opacity-80 select-none">
                Uncompromising Integrity Is My Standard
              </span>
              <h1 className="relative text-[clamp(1.5rem,3.7vw,2.1rem)] font-black uppercase tracking-tight text-[#d1460d]">
                Uncompromising Integrity Is My Standard
              </h1>
            </div>

            <p className="my-5">
              For a Chief Petty Officer, integrity is not optional—it is the bedrock of leadership and service. It means living by the highest moral compass, upholding traditions, and setting the example for all who follow. This standard is more than words; it reflects a lifetime of discipline, accountability, and pride in the uniform. By embodying uncompromising integrity, every Chief carries forward the Navy&apos;s legacy of honor, courage, and commitment.
            </p>
            <a href="/products">
            <Button className="w-[80%] bg-[#d1460d] text-white cursor-pointer">Shop</Button>
            </a>
          </div>
        </div>
        <div className="mt-[200px]">
        <ProductGrid
          collectionHandle="hunting-and-fishing-hats"
          title="Check Out Hunting and Fishing"
          start={0}
          end={4}
        />
        </div>
        <ProductGrid />
        <Newsletter />
      </main>
    </div>
  );
}
