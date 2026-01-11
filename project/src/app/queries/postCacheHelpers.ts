import { QueryClient } from '@tanstack/react-query';

type PostUpdater = (post: any) => any;
type PostsPage = {
    posts: Post[];
};

/**
 * Updates a post across ALL infinite post feeds
 * (home-posts, group-posts, profile-posts, etc.)
 */
export function updatePostInAllFeeds(
    queryClient: QueryClient,
    postId: string,
    updater: PostUpdater
) {
    queryClient.setQueriesData(
        {
            predicate: (query) => {
                const key = query.queryKey;
                return (
                    Array.isArray(key) &&
                    key.some(
                        (k) => typeof k === 'string' && k.endsWith('-posts')
                    )
                );
            },
        },
        (oldData: any) => {
            if (!oldData?.pages) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    posts: page.posts.map((post: any) =>
                        post.id === postId ? updater(post) : post
                    ),
                })),
            };
        }
    );
}

/**
 * Snapshot all post feeds for rollback
 */
export function snapshotAllPostFeeds(queryClient: QueryClient) {
    return queryClient.getQueriesData({
        predicate: (query) => {
            const key = query.queryKey;
            return (
                Array.isArray(key) &&
                key.some(
                    (k) => typeof k === 'string' && k.endsWith('-posts')
                )
            );
        },
    });
}

/**
 * Rollback helper
 */

type Snapshot = [readonly unknown[], unknown];

export function rollbackPostFeeds(
    queryClient: QueryClient,
    snapshots?: Snapshot[]
) {
    if (!snapshots) return;

    snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
    });
}

import { InfiniteData } from '@tanstack/react-query';
import { Post } from '../types/post';



export function removePostFromAllFeeds(
    queryClient: QueryClient,
    postId: string
) {
    queryClient.setQueriesData(
        {
            predicate: (query) => {
                const key = query.queryKey;
                return (
                    Array.isArray(key) &&
                    key.some(
                        (k) => typeof k === 'string' && k.endsWith('-posts')
                    )
                );
            },
        },
        (oldData: InfiniteData<PostsPage> | undefined) => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    posts: page.posts.filter((post) => post.id !== postId),
                })),
            };
        }
    );
}

export function addPostToAllFeeds(
    queryClient: QueryClient,
    post: Post
) {
    queryClient.setQueriesData(
        {
            predicate: (query) => {
                const key = query.queryKey;
                return (
                    Array.isArray(key) &&
                    key.some(
                        (k) => typeof k === 'string' && k.endsWith('-posts')
                    )
                );
            },
        },
        (oldData: InfiniteData<PostsPage> | undefined) => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page, index) => ({
                    ...page,
                    posts: index === 0 ? [post, ...page.posts] : page.posts,
                })),
            };
        }
    );
}


