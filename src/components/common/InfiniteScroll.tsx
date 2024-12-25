'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  className?: string;
  windowSize?: number;
}

export default function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  className = '',
  windowSize = 100,
}: InfiniteScrollProps<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  // Calculate the visible window of items
  const visibleItems = useMemo(() => {
    const endIndex = Math.min(startIndex + windowSize, items.length);
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, windowSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
      const scrollingDown = scrollTop > lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      if (scrollingDown) {
        // When scrolling down, if we're past 75% of the window size,
        // move the window forward by 25%
        if (startIndex + windowSize < items.length &&
            scrollTop > container.scrollHeight * 0.75) {
          const moveBy = Math.floor(windowSize * 0.25);
          setStartIndex(prev => Math.min(prev + moveBy, items.length - windowSize));
        }
      } else {
        // When scrolling up, if we're near the top,
        // move the window backward by 25%
        if (startIndex > 0 && scrollTop < container.scrollHeight * 0.25) {
          const moveBy = Math.floor(windowSize * 0.25);
          setStartIndex(prev => Math.max(0, prev - moveBy));
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, startIndex, windowSize]);

  return (
    <div className={className}>
      <div 
        ref={containerRef} 
        className="max-h-[calc(100vh-200px)] overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {visibleItems.map(renderItem)}
        </div>
        
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </div>

        {!hasMore && !loading && items.length > 0 && (
          <div className="text-center text-gray-400 py-4">
            No more items to load
          </div>
        )}
      </div>
    </div>
  );
}
