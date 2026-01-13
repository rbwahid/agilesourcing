'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Pencil,
  Trash2,
  Tag,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProductCatalogItem } from '@/types/supplier';

interface CatalogItemCardProps {
  item: ProductCatalogItem;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CatalogItemCard({
  item,
  isOwner = false,
  onEdit,
  onDelete,
}: CatalogItemCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = item.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const specs = Object.entries(item.specifications || {}).slice(0, 3);

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max && min !== max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return `$${(min || max)?.toLocaleString()}`;
  };

  const priceDisplay = formatPrice(item.price_range_min, item.price_range_max);

  const goToPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border border-gray-100 bg-white',
        'transition-all duration-300 ease-out',
        'hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40',
        'hover:-translate-y-1'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Owner Actions */}
      {isOwner && (
        <div
          className={cn(
            'absolute right-3 top-3 z-20 flex items-center gap-1.5',
            'opacity-0 transition-all duration-200 group-hover:opacity-100'
          )}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Pencil className="h-3.5 w-3.5 text-gray-600" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-rose-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          </Button>
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {hasImages ? (
          <>
            {/* Current Image */}
            <Image
              src={images[currentImageIndex]}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation Arrows */}
            {hasMultipleImages && isHovered && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      index === currentImageIndex
                        ? 'w-4 bg-white'
                        : 'w-1.5 bg-white/60 hover:bg-white/80'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Image Count Badge */}
            {hasMultipleImages && (
              <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {currentImageIndex + 1}/{images.length}
              </div>
            )}
          </>
        ) : (
          /* Placeholder */
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-xs text-gray-400">No images</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-gray-100 text-gray-600 hover:bg-gray-100"
          >
            <Tag className="h-3 w-3" />
            {item.category}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-agile-teal">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {item.description}
          </p>
        )}

        {/* Price Range */}
        {priceDisplay && (
          <p className="mt-3 font-serif text-lg font-semibold text-charcoal">
            {priceDisplay}
            <span className="ml-1.5 text-xs font-normal text-gray-500">
              per unit
            </span>
          </p>
        )}

        {/* Specifications */}
        {specs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {specs.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600"
              >
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="ml-1">{value}</span>
              </span>
            ))}
            {Object.keys(item.specifications || {}).length > 3 && (
              <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500">
                +{Object.keys(item.specifications || {}).length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-agile-teal to-mint-accent',
          'w-0 transition-all duration-300 group-hover:w-full'
        )}
      />
    </Card>
  );
}

export function CatalogItemCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 bg-white">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] animate-pulse bg-gray-100" />

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="mt-2 space-y-1.5">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="mt-3 h-6 w-24 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-5 w-16 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
