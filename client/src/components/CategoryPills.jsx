import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  'All',
  'Tech',
  'Gaming',
  'Music',
  'Education',
  'Entertainment',
  'News',
  'Sports',
  'Podcasts'
];

const CategoryPills = ({ selectedCategory = 'All', onSelectCategory }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center w-full bg-yt-bg/95 backdrop-blur py-3 sticky top-14 z-20 select-none">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-yt-surface/80 hover:bg-yt-surfaceHover text-white mr-2 shrink-0 border border-yt-border shadow-md"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth w-full px-1"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-yt-surface hover:bg-yt-surfaceHover text-yt-text'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-yt-surface/80 hover:bg-yt-surfaceHover text-white ml-2 shrink-0 border border-yt-border shadow-md"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategoryPills;
