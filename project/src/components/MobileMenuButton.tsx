'use client'
import { useState, useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import SideBarMobileMenu from './SideBarMobileMenu';


const MobileMenuButton = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <div className='md:hidden flex justify-center'>
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <AiOutlineMenu color='white' size={32} />
                </button>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <SideBarMobileMenu
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
        </>
    );
};

export default MobileMenuButton;