import { useCallback, useRef } from 'react'

export const useInfiniteScroll = (
    isFetching: boolean,
    hasNextPage: boolean | undefined,
    fetchNextPage: () => void
) => {
    const observer = useRef<IntersectionObserver | null>(null)

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetching) return

            if (observer.current) observer.current.disconnect()

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            })

            if (node) observer.current.observe(node)
        },
        [isFetching, hasNextPage, fetchNextPage]
    )

    return lastElementRef
}
