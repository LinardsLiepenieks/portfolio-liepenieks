import React, { useEffect, useMemo, useRef, useState } from 'react';

type ImageObj = { src: string; caption?: string };

type Props = {
  backgroundUrl?: string;
  logoUrl?: string;
  images?: ImageObj[];
};

export default function ProjectGallery({
  backgroundUrl,
  logoUrl,
  images: propImages,
}: Props) {
  // Build images array of objects { src, caption }
  const images: ImageObj[] = useMemo(() => {
    // If parent passed explicit images, use them (already normalized)
    if (propImages && propImages.length > 0) return propImages;

    const list: ImageObj[] = [];
    if (backgroundUrl) list.push({ src: backgroundUrl });
    if (logoUrl) list.push({ src: logoUrl });

    // Do not inject placeholder images. If no images are provided,
    // return whatever (background/logo) values we have and render empty otherwise.
    return list;
  }, [backgroundUrl, logoUrl, propImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const intervalRef = useRef<number | null>(null);

  // THUMBNAIL PARAMETERS - Easy to adjust
  const THUMBNAIL_CONFIG = {
    // Base size for the longest dimension of thumbnails
    baseLongestDimension: 500,
    // Quality setting (0.0 to 1.0)
    jpegQuality: 0.5,
    // Downscaling aggressiveness (1.5 = gentle, 2.0 = moderate, 3.0 = aggressive)
    progressiveThreshold: 1,
    // Step size for progressive downscaling (0.7 = 30% reduction per step, 0.5 = 50% reduction)
    progressiveStepSize: 0.8,
  };

  // Downscale using canvas - ensures consistent sizing regardless of aspect ratio
  const downscaleImage = (
    img: HTMLImageElement,
    config: typeof THUMBNAIL_CONFIG
  ): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return img.src;

    // Calculate target dimensions based on longest dimension
    // This ensures all images are downscaled by the same proportion
    const imgAspect = img.width / img.height;
    const longestOriginal = Math.max(img.width, img.height);
    const scaleFactor = config.baseLongestDimension / longestOriginal;

    let targetWidth: number;
    let targetHeight: number;

    if (img.width > img.height) {
      // Landscape or square
      targetWidth = config.baseLongestDimension;
      targetHeight = Math.round(config.baseLongestDimension / imgAspect);
    } else {
      // Portrait
      targetHeight = config.baseLongestDimension;
      targetWidth = Math.round(config.baseLongestDimension * imgAspect);
    }

    // Skip downscaling if image is already smaller than target
    if (longestOriginal <= config.baseLongestDimension) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/jpeg', config.jpegQuality);
    }

    let currentWidth = img.width;
    let currentHeight = img.height;

    canvas.width = currentWidth;
    canvas.height = currentHeight;
    ctx.drawImage(img, 0, 0);

    // Progressive downscaling for better quality
    while (
      currentWidth > targetWidth * config.progressiveThreshold ||
      currentHeight > targetHeight * config.progressiveThreshold
    ) {
      currentWidth = Math.max(
        Math.floor(currentWidth * config.progressiveStepSize),
        targetWidth
      );
      currentHeight = Math.max(
        Math.floor(currentHeight * config.progressiveStepSize),
        targetHeight
      );

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) break;

      tempCanvas.width = currentWidth;
      tempCanvas.height = currentHeight;
      tempCtx.drawImage(canvas, 0, 0, currentWidth, currentHeight);

      canvas.width = currentWidth;
      canvas.height = currentHeight;
      ctx.drawImage(tempCanvas, 0, 0);
    }

    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return img.src;

    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    finalCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    return finalCanvas.toDataURL('image/jpeg', config.jpegQuality);
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const promises = images.map(
        (it) =>
          new Promise<string>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              const thumbUrl = downscaleImage(img, THUMBNAIL_CONFIG);
              resolve(thumbUrl);
            };
            img.onerror = () => {
              resolve(it.src);
            };
            img.src = it.src;
          })
      );

      const urls = await Promise.all(promises);
      setThumbnailUrls(urls);
    };

    generateThumbnails();
  }, [images]);

  const startTimer = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (images.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 8000) as unknown as number;
  };

  useEffect(() => {
    setActiveIndex(0);
    startTimer();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.map((i) => i.src).join('|')]);

  const onThumbnailClick = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <div className="w-full">
      <div className="w-full aspect-[4/3]  border-1 border-zinc-400 shadow-md relative overflow-hidden bg-zinc-800">
        {images.map((it, idx) => (
          <img
            key={it.src}
            src={it.src}
            alt={it.caption ? it.caption : `Gallery image ${idx + 1}`}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out brightness-90 saturate-90 ${
              idx === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />
        ))}

        {/* Caption overlay - top-left */}
        {images[activeIndex]?.caption && (
          <div className="absolute bottom-0 left-0 bg-black/60 text-white text-sm px-3 py-1 backdrop-blur-sm">
            {images[activeIndex].caption}
          </div>
        )}
      </div>

      <div className="mt-6 w-full grid grid-cols-5 gap-2">
        {images.map((it, idx) => {
          const isActive = idx === activeIndex;
          const thumbSrc = thumbnailUrls[idx] || it.src;

          return (
            <button
              key={it.src}
              onClick={() => onThumbnailClick(idx)}
              className={`relative overflow-hidden border-1 ${
                isActive
                  ? 'border-neutral-400 ring-1 ring-zinc-600'
                  : 'border-neutral-600'
              } focus:outline-none aspect-[4/3] bg-neutral-800 group`}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <img
                src={thumbSrc}
                alt={it.caption ? it.caption : `Thumbnail ${idx + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out brightness-85 saturate-80  ${
                  isActive
                    ? 'opacity-100 scale-105'
                    : 'opacity-50 group-hover:opacity-80 group-hover:cursor-pointer blur-[0.5px]'
                }`}
                draggable={false}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              />
            </button>
          );
        })}
      </div>
      {/* (caption moved into overlay) */}
    </div>
  );
}
