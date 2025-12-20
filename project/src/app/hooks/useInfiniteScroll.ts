import { useCallback, useRef } from 'react';

export const useInfiniteScroll = (
    loading: boolean,
    hasMore: boolean,
    setPage: React.Dispatch<React.SetStateAction<number>>
) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLElement | null) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, setPage]);

    return lastElementRef;
};
