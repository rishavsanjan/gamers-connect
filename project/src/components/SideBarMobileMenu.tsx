import Link from 'next/link';
import React, { SetStateAction } from 'react'
import { BiSearch, BiTrendingUp, BiUser } from 'react-icons/bi';
import { CgCommunity } from 'react-icons/cg';
import { LuGamepad2, LuLibrary } from 'react-icons/lu';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useUser } from '@/context/UserContext';
import { RiUserFollowLine } from 'react-icons/ri';
import { logout } from '@/lib/auth';
import { useLoginModal } from '@/context/LoginModalContext';

interface Props {
    isMobileMenuOpen:boolean
    setIsMobileMenuOpen:React.Dispatch<SetStateAction<boolean>>;
}


const SideBarMobileMenu:React.FC<Props> = ({setIsMobileMenuOpen ,isMobileMenuOpen}) => {
    const {isLoggedIn, setUser} = useUser();
    const {openLoginModal} = useLoginModal();
    return (
        <div className={`fixed top-0 right-0 h-full w-64 bg-[#1a1a1a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
            {/* Close Button */}
            <div className="flex justify-end p-4">
                <button onClick={() => setIsMobileMenuOpen(false)}>
                    <AiOutlineClose color='white' size={28} />
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-6 px-6 py-4">
                <Link
                    href="/library"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                >
                    <LuLibrary className="text-2xl " />
                    <span>Library</span>
                </Link>

                <Link
                    href="/trending"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                >
                    <BiTrendingUp className="text-2xl " />
                    <span>Trending</span>
                </Link>

                <Link
                    href="/community"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                >
                    <CgCommunity className="text-2xl " />
                    <span>Community</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-700 my-2" />

                {/* Profile Section */}
                {isLoggedIn ? (
                    <>
                        <Link
                            href="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors z-100"
                        >
                            <BiUser className="text-2xl" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors z-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={`/profile/follow-requests`}>
                            <RiUserFollowLine className="text-2xl" />
                            Follow Requests
                        </Link>

                        <button
                            onClick={async () => {
                                await logout();
                                setUser(null);
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-red-500 transition-colors text-left"
                        >
                            <span className="text-2xl">⎋</span>
                            <span>Sign Out</span>
                        </button>
                    </>
                ) : (

                    <button
                        className='flex flex-row items-center gap-2'
                        onClick={() => {
                            openLoginModal();
                            setIsMobileMenuOpen(false)

                        }}>
                        <BiUser className="text-2xl" />

                        <span> Login/Signup</span>

                    </button>

                )}
            </div>
        </div>
    )
}

export default SideBarMobileMenu