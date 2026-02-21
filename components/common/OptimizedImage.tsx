/**
 * Optimized Image Component
 * 
 * A wrapper around Next.js Image component that provides:
 * - Automatic lazy loading
 * - Blur placeholder support
 * - Proper sizing and optimization
 * - Fallback handling
 * - R2 CDN optimization
 */

'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect, forwardRef } from 'react'
import { resolveR2Url } from '@/lib/image-utils'


interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
    fallbackSrc?: string
    enableBlur?: boolean
    wrapperClassName?: string
}

// Simple blur placeholder data URL
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxOAPwCwAB//2Q=='

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
    src,
    alt,
    fallbackSrc = '/placeholder-car.svg',
    enableBlur = true,
    priority = false,
    quality = 85,
    wrapperClassName = '',
    fill,
    className,
    ...props
}, ref) => {
    const resolvedSrc = resolveR2Url(src as string);
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Reset error and loading state when src changes
    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleError = () => {
        setHasError(true)
        setIsLoading(false)
    }

    const displaySrc = hasError ? (fallbackSrc || '/placeholder-car.svg') : resolvedSrc;

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} ${wrapperClassName}`}>
            <Image
                ref={ref}
                src={displaySrc}
                alt={alt}
                quality={quality}
                priority={priority}
                {...(priority ? {} : { loading: 'lazy' })}
                placeholder={enableBlur ? 'blur' : 'empty'}
                blurDataURL={enableBlur ? BLUR_DATA_URL : undefined}
                onError={handleError}
                onLoad={handleLoad}
                fill={fill}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                {...props}
            />
            {/* Loading skeleton with fade-out transition */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Shimmer animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
        </div>
    )
})

OptimizedImage.displayName = 'OptimizedImage'
