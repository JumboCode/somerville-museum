/**
 * @fileoverview Contains layout and logic for the signup confirmed page. Page 
 * is not currently being used for anything b/c of how clerk handles creating accounts.
 * 
 * @file signup_confirmed/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

"use client";

import '../app.css';
import { useRouter } from 'next/navigation'; 

export default function ConfirmSignup() {
  const router = useRouter();
  return (
    <div className={'login-bg'}>
      <div className="confirmContainer">
        <div>Thank you for signing up!</div>
        <br />
        <div className={'bodyConfirmContainer'}>
          Somerville Museum will verify your account. You will receive an email when verified.
        </div>
        <input
          className={'returnButton'}
          style={{ marginTop: "5vh" }}
          type="button"
          onClick={() => {router.push("/login")}}
          value={'Back to Login'}
        />
      </div>
    </div>
  );
}
