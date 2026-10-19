"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { PropertyImage } from "@/types/property";

const FALLBACK_IMAGE: PropertyImage = {
  src: "/images/property-placeholder/property-placeholder.svg",
  alt: "Imagem do imóvel temporariamente indisponível",
  isPrimary: true,
};

type PropertyGalleryProps = Readonly<{
  images: readonly PropertyImage[];
}>;

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const displayImages = useMemo(() => {
    if (images.length === 0) return [FALLBACK_IMAGE];

    return [...images].sort(
      (left, right) => Number(right.isPrimary) - Number(left.isPrimary),
    );
  }, [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeSelectedIndex = Math.min(selectedIndex, displayImages.length - 1);
  const selectedImage = displayImages[safeSelectedIndex] ?? FALLBACK_IMAGE;
  const hasMultipleImages = displayImages.length > 1;
  const secondaryImages = displayImages
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== safeSelectedIndex)
    .slice(0, 2);
  const remainingImageCount = Math.max(
    0,
    displayImages.length - secondaryImages.length - 1,
  );

  function showPreviousImage() {
    setSelectedIndex(
      safeSelectedIndex === 0
        ? displayImages.length - 1
        : safeSelectedIndex - 1,
    );
  }

  function showNextImage() {
    setSelectedIndex((safeSelectedIndex + 1) % displayImages.length);
  }

  return (
    <section aria-label="Galeria de imagens do imóvel">
      <div
        className={`${
          hasMultipleImages
            ? "lg:grid lg:h-[clamp(22rem,30vw,27rem)] lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)] lg:gap-3"
            : "mx-auto max-w-3xl"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-lg bg-surface-subtle shadow-soft ${
            hasMultipleImages
              ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-r-none"
              : "aspect-video"
          }`}
        >
          <Image
            alt={selectedImage.alt}
            className="object-contain"
            fill
            priority={safeSelectedIndex === 0}
            sizes={
              hasMultipleImages
                ? "(min-width: 1280px) 820px, (min-width: 1024px) 65vw, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 2.5rem)"
                : "(min-width: 1024px) 768px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 2.5rem)"
            }
            src={selectedImage.src}
          />

          {hasMultipleImages ? (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-4 sm:inset-x-4 sm:bottom-4">
              <div className="flex gap-2">
                <button
                  aria-label="Mostrar imagem anterior"
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface/95 text-foreground shadow-control transition-colors hover:bg-accent"
                  onClick={showPreviousImage}
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                    <path d="m12.5 4.5-5.5 5.5 5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  </svg>
                </button>
                <button
                  aria-label="Mostrar próxima imagem"
                  className="grid h-11 w-11 place-items-center rounded-full bg-surface/95 text-foreground shadow-control transition-colors hover:bg-accent"
                  onClick={showNextImage}
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                    <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  </svg>
                </button>
              </div>
              <p className="rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-bold text-white shadow-control">
                <span className="sr-only">Imagem </span>
                {safeSelectedIndex + 1} / {displayImages.length}
              </p>
            </div>
          ) : null}
        </div>

        {hasMultipleImages ? (
          <div
            className={`hidden h-full gap-3 lg:grid ${
              secondaryImages.length > 1 ? "grid-rows-2" : "grid-rows-1"
            }`}
          >
            {secondaryImages.map(({ image, index }, secondaryIndex) => (
              <button
                aria-label={`Mostrar imagem ${index + 1} de ${displayImages.length}: ${image.alt}`}
                className="group relative min-h-0 overflow-hidden bg-surface-subtle last:rounded-br-lg first:rounded-tr-lg"
                key={`${image.src}-${index}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.015]"
                  fill
                  sizes="(min-width: 1280px) 390px, 32vw"
                  src={image.src}
                />
                {secondaryIndex === secondaryImages.length - 1 &&
                remainingImageCount > 0 ? (
                  <span className="absolute bottom-4 right-4 rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-bold text-white shadow-control">
                    +{remainingImageCount} {remainingImageCount === 1 ? "foto" : "fotos"}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="mt-3 overflow-x-auto pb-1 sm:mt-4 lg:hidden">
          <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-5">
            {displayImages.map((image, index) => (
              <button
                aria-label={`Mostrar imagem ${index + 1} de ${displayImages.length}: ${image.alt}`}
                aria-pressed={safeSelectedIndex === index}
                className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md border-2 bg-surface-subtle transition-[border-color,opacity] sm:w-auto ${
                  safeSelectedIndex === index
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                key={`${image.src}-${index}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(min-width: 640px) 16vw, 96px"
                  src={image.src}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
