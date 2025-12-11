'use client';

/**
 * CohortTile Component
 * 
 * Displays a single cohort as a clickable tile in the lobby grid.
 * Features futuristic styling with:
 * - Grayscale to color image transition on hover
 * - Teal border glow effect
 * - Smooth animations
 */

import Image from 'next/image';
import Link from 'next/link';

interface CohortTileProps {
  /** Cohort unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Path to cohort image */
  image: string;
  /** Brief description */
  description: string;
  /** Optional capacity limit */
  capacity?: number;
}

export default function CohortTile({
  id,
  name,
  image,
  description,
  capacity,
}: CohortTileProps) {
  return (
    <Link
      href={`/session/${id}`}
      className="group relative block overflow-hidden rounded-lg border border-overcast-gray-dark/30 bg-overcast-dark transition-all duration-300 hover:border-overcast-teal/50 hover:shadow-lg hover:shadow-overcast-teal/10"
    >
      {/* Image Container */}
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={image}
          alt={`${name} classroom`}
          fill
          className="object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-overcast-black/80 via-transparent to-transparent" />
        
        {/* Capacity badge */}
        {capacity && (
          <div className="absolute top-3 right-3 rounded-full bg-overcast-black/70 px-2 py-1 text-xs text-overcast-gray backdrop-blur-sm">
            {capacity} seats
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title with teal accent */}
        <h3 className="text-lg font-bold uppercase tracking-wider text-overcast-teal transition-colors group-hover:text-overcast-white">
          {name}
        </h3>
        
        {/* Description */}
        <p className="mt-1 text-sm text-overcast-gray line-clamp-2">
          {description}
        </p>
        
        {/* Join indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-overcast-gray transition-colors group-hover:text-overcast-teal">
          <span className="inline-block h-2 w-2 rounded-full bg-overcast-teal animate-pulse" />
          Click to join session
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 rounded-lg border border-overcast-teal/30" />
      </div>
    </Link>
  );
}

