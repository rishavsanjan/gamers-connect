import { User } from '@prisma/client'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
    members: Array<{
        name: string | null,
        username: string,
        id: string,
        avatar: string | null
    }>
    groupId:string
}

const InfiniteGroupMembers: React.FC<Props> = ({ members,groupId }) => {

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [membersState, setMembersState] = useState(members);


    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore]);


    const getPosts = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: `/api/get-group-members?page=${page}`,
                method: 'post',
                data: { groupId }
            });

            const newMembers = response.data.posts;
            console.log(newMembers)
            if (page === 1) {
                setMembersState(newMembers);
            } else {
                setMembersState(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueMembers = newMembers.filter((member: User) => !existingIds.has(member.id));
                    return [...prev, ...uniqueMembers];
                });
            }

            if (newMembers.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (page === 1) return;

        getPosts();
    }, [page]);

    return (
        <div ref={lastPostRef}>

        </div>
    )
}

export default InfiniteGroupMembers