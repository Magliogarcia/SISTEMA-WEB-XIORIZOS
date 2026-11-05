"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  lazy?: boolean;
}

export function OptimizedVideo({
  src,
  poster,
  className = "",
  lazy = true,
}: OptimizedVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(!lazy);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!lazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px", // Comienza a cargar 300px antes de llegar a la pantalla
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Limpieza inmediata del hardware decoder al desmontar (evita lag al cambiar de página)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    return () => {
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch {
        // Ignorar si ya se cerró
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5"
    >
      {/* Poster instantáneo para que jamás se vea vacío o negro */}
      {poster && (
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 pointer-events-none ${
            isReady ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={poster}
            alt="Vista previa del video"
            fill
            sizes="500px"
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      {/* Video con carga bajo demanda optimizada */}
      {isInView && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          preload="auto"
          onCanPlay={() => setIsReady(true)}
          onPlaying={() => setIsReady(true)}
          className={`${className} transition-opacity duration-500 ${
            isReady || !poster ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

