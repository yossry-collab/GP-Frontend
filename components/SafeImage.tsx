"use client";

/* eslint-disable @next/next/no-img-element */

import React, {
  ImgHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: React.ReactNode;
  fallbackClassName?: string;
};

export default function SafeImage({
  src,
  alt,
  className,
  fallback,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={
          fallbackClassName || "w-full h-full flex items-center justify-center"
        }
      >
        {fallback || <span className="text-3xl opacity-25">🎮</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product image"}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
