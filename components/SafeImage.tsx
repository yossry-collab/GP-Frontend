"use client";

import React, { ImgHTMLAttributes, useEffect, useState } from "react";

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
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
