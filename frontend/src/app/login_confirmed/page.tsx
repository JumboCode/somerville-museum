"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../app.css";

export default function LoginConfirmed() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/dashboard"); // Redirect to /dashboard after 1 second
        }, 500);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [router]);

    return (
        <div className="login-bg">
            <div className="confirmContainer">
                <Image src="/icons/checkmark.png" alt="Checkmark" width={50} height={50} />
                <div style={{ marginTop: "2vh" }}>Login Successful</div>
            </div>
        </div>
    );
}
