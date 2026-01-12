'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestorer({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useLayoutEffect(() => {
        const key = `scroll:${pathname}`;
        const savedScroll = sessionStorage.getItem(key);

        const container = document.getElementById('post-scroll');
        if (!container || savedScroll === null) return;

        container.scrollTop = Number(savedScroll);
    }, [pathname]);



    return <>{children}</>;
}
