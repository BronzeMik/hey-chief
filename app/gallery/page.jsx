"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import styles from "../../styles/gallery.module.css"

const servicePhotos = [
  {
    src: "/Gallery/IMG_1854.JPG",
    alt: "Boot camp graduation",
    description: "",
  },
  {
    src: "/Gallery/IMG_1856.JPG",
    alt: "On deployment",
    description: "",
  },
  {
    src: "/Gallery/IMG_1858.JPG",
    alt: "On deployment",
    description: "",
  },
  {
    src: "/Gallery/IMG_1859.JPG",
    alt: "On deployment",
    description: "",
  },
  {
    src: "/Gallery/IMG_1861.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1860.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1862.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1863.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1864.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1865.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1866.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1867.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1868.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1869.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1871.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1872.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1874.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1875.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1876.jpg",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1877.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1878.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1879.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1880.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1881.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1882.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1883.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1885.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1886.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1887.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1888.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1889.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1890.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1892.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1893.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1894.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1895.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1896.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1897.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1899.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1900.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1901.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1902.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1903.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1904.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1905.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1907.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1908.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1909.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1910.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1911.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1912.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1914.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1915.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1916.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1917.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1918.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1919.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1920.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1921.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1922.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1923.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1924.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1926.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1928.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1929.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1930.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1931.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1932.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1933.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1934.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1935.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1936.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1937.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1939.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1941.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1942.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1943.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1944.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1945.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1946.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1947.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1948.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1949.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1950.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1951.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1952.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1954.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1956.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1958.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1959.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1961.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1962.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1964.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1965.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1967.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1969.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1971.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1972.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1974.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1975.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1976.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1977.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1978.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1979.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1985.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1986.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1988.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1989.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1990.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1991.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1992.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1993.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1995.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1997.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1998.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1983.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2001.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2002.png",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2004.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2005.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2006.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2007.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2008.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2009.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2011.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2013.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2014.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2016.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2017.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2019.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2020.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2021.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1922.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2023.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2024.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2026.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2028.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2029.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2031.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2032.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2034.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2035.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2036.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2037.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2039.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2041.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2043.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2044.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2046.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2047.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2049.jpg",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_9990.jpg",
    alt: "With the team",
    description: "",
  },
];
// import servicePhotos + styles as you already do
// const servicePhotos = [{ src, alt, description }, ...]
// import styles from "./MilitaryGallery.module.css";

export default function MilitaryGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // preloaded[i] === true when image i is loaded into browser cache
  const [preloaded, setPreloaded] = useState(() => servicePhotos.map(() => false));
  const preloadedRef = useRef(preloaded);
  preloadedRef.current = preloaded;

  // Preload all images on mount (non-blocking). This reduces spinner times a lot.
  useEffect(() => {
    let mounted = true;
    servicePhotos.forEach((p, i) => {
      const img = new window.Image();
      img.src = p.src;
      img.onload = () => {
        if (!mounted) return;
        setPreloaded((prev) => {
          if (prev[i]) return prev; // already true
          const next = [...prev];
          next[i] = true;
          return next;
        });
      };
      // optional: onerror can mark as loaded to avoid infinite spinner
      img.onerror = () => {
        if (!mounted) return;
        setPreloaded((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      };
    });
    return () => {
      mounted = false;
    };
  }, []);

  // When opening the lightbox, ensure next+prev image are preloaded (if not already).
  useEffect(() => {
    if (!isOpen) return;
    const nextIdx = (photoIndex + 1) % servicePhotos.length;
    const prevIdx = (photoIndex + servicePhotos.length - 1) % servicePhotos.length;

    [photoIndex, nextIdx, prevIdx].forEach((i) => {
      if (!preloadedRef.current[i]) {
        const img = new window.Image();
        img.src = servicePhotos[i].src;
        img.onload = () => {
          setPreloaded((prev) => {
            if (prev[i]) return prev;
            const next = [...prev];
            next[i] = true;
            return next;
          });
        };
        img.onerror = () => {
          setPreloaded((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        };
      }
    });
  }, [isOpen, photoIndex]);

  // Helper to know if the current mainSrc is ready (cached)
  const mainReady = preloaded[photoIndex];

  // Lightbox slides for YARL
  const slides = useMemo(
    () =>
      servicePhotos.map((p) => ({
        src: p.src,
        description: p.description, // used by Captions plugin
        alt: p.alt,
      })),
    []
  );

  return (
    <div className={styles.container}>
      <h1>Owner&apos;s Military Service</h1>
      <p>Honoring a legacy of dedication, courage, and service.</p>

      {/* show a subtle message while preloading initial images */}
      {!preloaded.every(Boolean) && (
        <div style={{ margin: "0.5rem 0", color: "#666", fontSize: 14 }}>
          Preloading images… this may take a second on slow connections.
        </div>
      )}

      <div className={styles.gallery}>
        {servicePhotos.map((photo, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 600px) 100vw, 300px"
                className={styles.image}
                priority={index < 2} // optionally prioritize first two thumbnails
              />
            </div>
            <p className={styles.description}>{photo.description}</p>
          </div>
        ))}
      </div>

      {/* New lightbox (React 18 compatible) */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Captions]}
        on={{ view: ({ index }) => setPhotoIndex(index) }}
        // optional: simple guard to avoid showing an unready slide
        render={{
          slide: ({ slide, rect }) => {
            if (!mainReady) return <div style={{ height: rect.height }} />;
            return undefined; // use default renderer once ready
          },
        }}
      />
    </div>
  );
}
