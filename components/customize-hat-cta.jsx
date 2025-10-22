// components/CustomizeHatCTA.jsx
"use client";

import { useRouter } from "next/navigation";

export default function CustomizeHatCTA() {
  const router = useRouter();

  return (
    <section className="w-full py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <img src='/customizer-home-page-cta.png' />
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Design Your Perfect Hat
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Personalize every detail — choose from over 100 different color options!
          Preview your creation in 3D before you order.
        </p>
        <button
          onClick={() => router.push("/customizer")}
          className="inline-flex cursor-pointer items-center justify-center px-10 py-4 text-lg font-medium text-white bg-black rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Start Customizing
        </button>
      </div>
    </section>
  );
}
