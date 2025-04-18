'use client'

import React from "react";
import { usePathname, useRouter } from 'next/navigation';

const Brick = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleClick = () => {
        if (pathname === '/inventory') {
            window.location.reload();
        } else {
            router.push('/inventory');
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <svg id="brick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M7 1H1V5H7V1Z M7 7H1V15H7V7Z M9 1H15V9H9V1Z M15 11H9V15H15V11Z" />
            </svg>
        </div>
    );
};

export default Brick;
