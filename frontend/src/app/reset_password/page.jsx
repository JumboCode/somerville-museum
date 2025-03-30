/**
 * @fileoverview Contains layout and logic for the reset password page with a custom clerk flow.
 * 
 * @file reset_password/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

 "use client"

 import { useState } from 'react'
 import { useRouter } from 'next/navigation'
 import { useSignIn } from '@clerk/nextjs'
 import Image from "next/image"
 import '../app.css'
 
 export default function ResetPassword () {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [code, setCode] = useState('');
     const [step, setStep] = useState(1); // 1 = Enter email, 2 = Enter code + password
     const [error, setError] = useState('');
 
     const router = useRouter();
     const { isLoaded, signIn, setActive } = useSignIn();
 
     if (!isLoaded) return null;
 
     const containsUppercaseAndSymbol = (str) => {
       return /[A-Z]/.test(str) && /[^a-zA-Z0-9]/.test(str);
     }
 
     const resetFields = () => {
       setPassword('');
       setConfirmPassword('');
       setCode('');
     }
 
     // Step 1: Send reset password code to user email
     async function requestPasswordReset(e) {
       e.preventDefault();
       
       try {
         await signIn.create({
           strategy: 'reset_password_email_code',
           identifier: email,
         });
         setStep(2); // Move to the next step
       } catch (err) {
         setError(err.errors[0]?.longMessage || "Something went wrong.");
       }
     }
 
     // Step 2: Verify code & set new password
     async function resetPassword(e) {
       e.preventDefault();
 
       if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
         setError('Password must be at least 9 characters with an uppercase letter and a symbol.');
         resetFields();
         return;
       }
       if (password !== confirmPassword) {
         setError('Passwords do not match.');
         resetFields();
         return;
       }
 
       try {
         const result = await signIn.attemptFirstFactor({
           strategy: 'reset_password_email_code',
           code,
           password,
         });
 
         setActive({ session: result.createdSessionId });
         router.push("/reset_confirmed"); // Redirect after success
       } catch (err) {
         setError('Invalid code. Try again.');
         resetFields();
       }
     }
 
     return (
       <div className="login-bg">
         <div className="reset-password-container">
           <div className="back-to-login" onClick={() => router.push("/login")}>&lt; Back to Login</div>
           <div className="titleContainer">
             <div className="SMLogo sm-logo-small">
               <Image src="/SM_LOGO.svg" alt="Logo" fill />
             </div>
             <div className="clothing-database-small">CLOTHING DATABASE</div>
           </div>
 
           <div className="reset-password-text">
             <div className="password-text-larger">Reset Password</div>
             {step === 1 ? (
               <div>Please enter your email to receive a reset code.</div>
             ) : (
               <div>Enter the reset code sent to your email and set a new password.</div>
             )}
           </div>
 
           {error && <div className="error-message">{error}</div>}
 
           {step === 1 && (
             <>
               <div className="inputContainer">
                 <input
                   value={email}
                   placeholder="Email"
                   onChange={(e) => setEmail(e.target.value)}
                   className="inputBox"
                 />
               </div>
               <div className="inputContainer bottom">
                 <button className="inputButton" onClick={requestPasswordReset}>Send Reset Code</button>
               </div>
             </>
           )}
 
           {step === 2 && (
             <>
               <div className="inputContainer">
                 <input
                   value={code}
                   placeholder="Reset Code"
                   onChange={(e) => setCode(e.target.value)}
                   className="inputBox"
                 />
               </div>
               <div className="inputContainer">
                 <input
                   type="password"
                   value={password}
                   placeholder="New Password"
                   onChange={(e) => setPassword(e.target.value)}
                   className="inputBox"
                 />
               </div>
               <div className="inputContainer">
                 <input
                   type="password"
                   value={confirmPassword}
                   placeholder="Confirm Password"
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="inputBox"
                 />
               </div>
               <div className='inputContainer'>
                 <button className='inputButton' onClick={resetPassword}>Reset Password</button>
               </div>
             </>
           )}
         </div>
       </div>
     );
 }
 