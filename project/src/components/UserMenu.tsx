'use client'
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';
import { logout } from '@/lib/auth';
import { useGroupPostsStore } from '@/zustland/groupPostsStore';
import { usePostFeedStore } from '@/zustland/postFeedStore';
import { useProfileBookmarkStore } from '@/zustland/profileBookmarkStore';
import { useProfilePostsStore } from '@/zustland/profilePostsStore';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
import { BiUser } from 'react-icons/bi';

const UserMenu = () => {
    const queryClient = useQueryClient();
    const { setUser, isLoggedIn } = useUser();

    const { openLoginModal } = useLoginModal();

    return (
        <div className="md:flex hidden relative">
            {isLoggedIn ? (
                <div className="relative group">
                    {/* Profile Icon */}
                    <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer bg-[#202020] flex items-center justify-center hover:bg-white transition-all duration-200">
                        <BiUser className="text-2xl text-white group-hover:text-black transition-colors" />
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] text-white rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:scale-100 z-50">
                        <Link
                            href="/profile"
                            className="block px-4 py-2 hover:bg-white hover:text-black rounded-t-lg"
                        >
                            My Profile
                        </Link>
                        <Link
                            className="block px-4 py-2 hover:bg-white hover:text-black"
                            href="/profile/follow-requests"
                        >
                            Follow Requests
                        </Link>
                        <button
                            onClick={async () => {
                                await logout();
                                queryClient.clear();
                                setUser(null);
                                usePostFeedStore.getState().reset();
                                useGroupPostsStore.getState().reset();
                                useProfileBookmarkStore.getState().reset();
                                useProfilePostsStore.getState().reset();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white hover:text-black rounded-b-lg"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => { openLoginModal() }}>Login/Signup</button>
            )}
        </div>
    )
}

export default UserMenu