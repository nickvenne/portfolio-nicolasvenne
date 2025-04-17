import { BlockImage } from '.basehub/schema';
import React from 'react';
import { cn } from '~/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  file?: Partial<BlockImage> | null
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const Image: React.FC<ImageProps> = ({
  file,
  width,
  height,
  quality = 80,
  format = 'webp',
  className,
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
  ...props
}) => {
  if (!file?.url) {
    return null;
  }

  const src = file.url
  const optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}w=${width || ''}&q=${quality}&format=${format}`;

  return (
    <img
      src={optimizedSrc}
      alt={file.alt || ''}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      className={cn(
        'transition-opacity duration-300',
        objectFit ? `object-${objectFit}` : '',
        className
      )}
      {...props}
    />
  );
};
