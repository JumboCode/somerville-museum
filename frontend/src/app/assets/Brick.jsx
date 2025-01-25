'use client'

import React from "react";
import Link from "next/link";

const Brick = () => {
    return (
        <Link href="/inventory">
            <svg id="brick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M7 1H1V5H7V1Z M7 7H1V15H7V7Z M9 1H15V9H9V1Z M15 11H9V15H15V11Z" />
            </svg>
        </Link>
    );
};

export default Brick;
