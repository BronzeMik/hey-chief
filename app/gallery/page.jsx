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
    src: "/Gallery/IMG_1861.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1860.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1862.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1863.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1864.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1865.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1866.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1867.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1868.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1869.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1871.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1872.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1874.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1875.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1876.JPG",
    alt: "Receiving medal",
    description: "",
  },
  {
    src: "/Gallery/IMG_1877.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1878.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1879.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1880.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1881.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1882.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1883.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1885.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1886.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1887.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1888.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1889.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1890.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1892.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1893.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1894.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1895.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1896.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1897.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1899.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1900.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1901.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1902.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1903.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1904.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1905.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1907.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1908.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1909.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1910.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1911.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1912.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1914.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1915.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1916.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1917.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1918.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1919.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1920.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1921.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1922.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1923.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1924.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1926.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1928.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1929.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1930.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1931.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1932.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1933.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1934.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1935.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1936.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1937.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1939.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1941.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1942.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1943.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1944.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1945.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1946.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1947.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1948.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1949.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1950.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1951.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1952.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1954.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1956.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1958.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1959.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1961.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1962.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1964.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1965.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1967.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1969.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1971.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1972.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1974.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1975.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1976.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1977.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1978.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1979.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1985.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1986.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1988.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1989.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1990.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1991.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1992.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1993.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1995.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1997.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1998.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1983.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2001.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2002.PNG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2004.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2005.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2006.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2007.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2008.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2009.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2011.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2013.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2014.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2016.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2017.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2019.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2020.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2021.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_1922.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2023.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2024.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2026.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2028.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2029.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2031.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2032.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2034.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2035.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2036.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2037.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2039.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2041.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2043.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2044.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2046.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2047.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_2049.JPG",
    alt: "With the team",
    description: "",
  },
  {
    src: "/Gallery/IMG_9990.JPG",
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
