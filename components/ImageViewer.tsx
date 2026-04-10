// components/ImageViewer.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
    images: Array<{
        id: string;
        preview: string;
        caption: string;
        year: string;
    }>;
    initialIndex: number;
    onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const dialogRef = useRef<HTMLDivElement>(null);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
            // Focus trap: Tab cycles within the viewer
            if (e.key === 'Tab') {
                const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable && focusable.length > 0) {
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        // Prevent body scroll while viewer is open
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        // Auto-focus the close button on open
        const closeBtn = dialogRef.current?.querySelector<HTMLElement>('[data-close]');
        closeBtn?.focus();

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToPrevious, goToNext, onClose]);

    const currentImage = images[currentIndex];

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Image viewer: ${currentImage.caption || `Photo ${currentIndex + 1} of ${images.length}`}`}
            className="fixed inset-0 bg-warm-dark/95 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <button
                data-close
                onClick={onClose}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                aria-label="Close viewer"
            >
                <X size={24} className="text-surface-low" />
            </button>

            {images.length > 1 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={32} className="text-surface-low" />
                </button>
            )}

            <div className="relative max-w-7xl max-h-[90vh] mx-auto px-20">
                <img
                    src={currentImage.preview}
                    alt={currentImage.caption || 'Photo'}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />

                {(currentImage.caption || currentImage.year) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-warm-dark/90 to-transparent p-6 rounded-b-lg">
                        {currentImage.caption && (
                            <p className="text-surface-low text-lg mb-1">{currentImage.caption}</p>
                        )}
                        {currentImage.year && (
                            <p className="text-surface-low/70 text-sm">{currentImage.year}</p>
                        )}
                    </div>
                )}

                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-warm-dark/80 rounded-full" aria-live="polite">
                    <p className="text-surface-low text-sm">
                        {currentIndex + 1} / {images.length}
                    </p>
                </div>
            </div>

            {images.length > 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                    aria-label="Next image"
                >
                    <ChevronRight size={32} className="text-surface-low" />
                </button>
            )}

            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl overflow-x-auto">
                    <div className="flex gap-2 px-4">
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`View image ${idx + 1}${img.caption ? `: ${img.caption}` : ''}`}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                    ? 'border-olive scale-110'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={img.preview}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
