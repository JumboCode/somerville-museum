"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import "../app.css";

export default function LoginConfirmed() {
    const router = useRouter();
    const { signOut } = useClerk();

    return (
        <div className="login-bg">
            <div className="confirmContainer">
                <Image src="/icons/checkmark.png" alt="Checkmark" width={50} height={50} />
                <div style={{ marginTop: "2vh" }}>Password Change Successful</div>
                <div style={{ fontWeight: "lighter" }}>Your Password has been changed.</div>
                <input
                    className={'returnButton'}
                    style={{ marginTop: "5vh" }}
                    type="button"
                    onClick={() => {router.push("/login"), signOut()}}
                    value={'Back to Login'}
                />
            </div>
        </div>
    );
}
