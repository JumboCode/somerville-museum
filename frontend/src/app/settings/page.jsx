/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */
"use client";
import { useClerk } from "@clerk/nextjs"

export default function Settings() {
    const { signOut } = useClerk();

    return (
        <div onClick={signOut({ redirectUrl: '/' })}>Hello</div>
    );
}