import React, { useState, useEffect, useCallback } from 'react';
import { useGetSliders } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ImageSlider() {
  const { data: sliders = [], isLoading } = useGetSliders();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  }, [sliders.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  }, [sliders.length]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [sliders.length, goNext]);

  // Reset index if sliders change
  useEffect(() => {
    setCurrentIndex(0);
  }, [sliders.length]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-48 sm:h-64 bg-navy-800 rounded-2xl animate-pulse flex items-center justify-center">
        <ImageIcon className="w-10 h-10 text-navy-600" />
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto h-48 sm:h-64 bg-navy-800 border border-navy-600 rounded-2xl flex flex-col items-center justify-center gap-3">
        <ImageIcon className="w-12 h-12 text-navy-500" />
        <p className="text-navy-400 text-sm">No posters available yet</p>
      </div>
    );
  }

  const current = sliders[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Slide */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-800 border border-navy-600 shadow-navy">
        <img
          src={current.imageUrl}
          alt={current.title || `Slide ${currentIndex + 1}`}
          className="w-full h-48 sm:h-72 object-cover transition-opacity duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyYTNhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
          }}
        />
        {/* Title overlay */}
        {current.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/90 to-transparent px-6 py-4">
            <p className="text-white font-semibold text-lg font-rajdhani">{current.title}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-900/80 border border-navy-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-700"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-900/80 border border-navy-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-700"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-3">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? 'bg-gold-400 w-6' : 'bg-navy-600 hover:bg-navy-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
