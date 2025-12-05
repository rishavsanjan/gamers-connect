"use client";

import { useLoginModal } from "@/context/LoginModalContext";
import { LoginModal } from "@/components/NotLogged";

export default function LoginModalClient() {
    const { isOpen, closeLoginModal } = useLoginModal();

    return (
        <>
            {isOpen && <LoginModal isOpen={isOpen} setLoginModal={closeLoginModal} />}
        </>
    );
}
