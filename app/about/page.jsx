import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-900 antialiased font-sans">
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center relative">
        <div className="absolute inset-0 bg-[url('/images/flag-bg.jpg')] bg-cover bg-center opacity-10 -z-10"></div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Hey Chief Official</h1>
        <p className="text-2xl text-gray-700 font-medium drop-shadow-sm">Pride • Service • Unity</p>
        <img src={'/about-us-img-hey-chief.png'} className="md:w-[30%] mx-auto pt-7" />
      </section>

      {/* About / Story Section */}
      <section className="container mx-auto px-6 py-16 max-w-4xl bg-white rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Dear Fellow Patriots, Supporters, and Proud Americans!</h2>
        <div className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            From the time I was nine, I knew I was destined to serve this great nation. In a home filled with love,
            competition, and chaos, I found clarity in one powerful purpose: serving in the United States military.
            I still remember sitting on my bunk bed, legs swinging, dreaming of war movies, crisp uniforms, and the
            pride of defending our country.
          </p>

          <p>
            That dream came to life when my older brother sent home a photo of himself in his Marine Corps Dress
            Blues—“Honor Man” proudly displayed. That image changed everything. I trained, studied, and prepared for my
            calling. My path led me through the Army and finally the Navy, but my passion for the military—and what it
            instills in us—never wavered: strength, character, courage, and unity.
          </p>

          <p>
            I went on to serve proudly in the U.S. Navy, and at 60, I still carry that honor. That belief in service
            inspired Eyes Right Official—a brand born from patriotism and built to unite. Our caps and apparel aren’t
            just gear; they’re symbols of pride, connection, and heritage.
          </p>

          <p>
            Eyes Right is for the mother whose child just shipped off to boot camp, the veteran who still wakes up at
            0500, the brother cheering on his sibling in uniform—for every American who believes in the red, white,
            and blue and those who defend it.
          </p>

          <p>
            Every cap and shirt is infused with passion, dignity, and pride. They represent <strong>FOCUS. COURAGE.
            HONOR. DESIRE. COMPASSION. COMMITMENT.</strong> They’re made for those who care, who dare, and who strive to be
            better every single day.
          </p>

          <p>
            Whether you’re running early PT, deployed at sea, cheering at graduation, or reminiscing on your glory days—
            Eyes Right is here to honor your journey, your sacrifice, and your pride.
          </p>

          <p className="font-semibold text-lg text-center">This isn’t just a brand …</p>
          <p className="text-3xl font-extrabold text-center text-red-700 mt-2">IT’S A MOVEMENT!</p>
          <p className="mt-4 font-bold text-center text-gray-900">WITH HONOR</p>
        </div>
      </section>

      {/* Shop / CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4 text-gray-900">Shop Our Collection</h3>
        <p className="text-gray-700 mb-8 max-w-xl mx-auto">Caps, shirts, and apparel to show your pride and support our heroes.</p>
        <Link href={'/products'}>
        <Button size="lg" className="px-10 py-4 bg-red-700 text-white hover:bg-red-800 shadow-lg transition-all">Visit Shop</Button>
        </Link>
      </section>

      {/* Newsletter / Contact Section */}
      {/* <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Stay Connected</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Sign up for updates, behind-the-scenes stories, and special offers.</p>
          <form className="flex justify-center gap-4 flex-wrap">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <Button type="submit" className="bg-red-700 text-white px-8 py-3 hover:bg-red-800 shadow-lg transition-all">Subscribe</Button>
          </form>
        </div>
      </section> */}
      
    </main>
  );
}
