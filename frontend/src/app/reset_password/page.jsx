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
import { useAuth, useSignIn } from '@clerk/nextjs'
import Image from "next/image"
import '../app.css'
import 'dotenv/config'

export default function reset_password () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [error, setError] = useState('');
    const [errorBG, setErrorBG] = useState('no-error');

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    // If user already signed in, redirect to home page
    if (isSignedIn) {
      router.push('/dashboard')
    }

    const containsUppercaseAndSymbol = (str) => {
      const hasUppercase = /[A-Z]/.test(str); // Check for uppercase letters
      const hasSymbol = /[^a-zA-Z0-9]/.test(str); // Check for symbols (non-alphanumeric characters)
      return hasUppercase && hasSymbol;
    }

    const resetFields = () => {
      setPassword('');
      setConfirmPassword('');
      setCode('');
    }

    // Send pass reset code to user email
    async function create(e) {
      e.preventDefault()
      await signIn
        ?.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        })
        .then((_) => {
          setSuccessfulCreation(true)
        })
        .catch((err) => {
          console.error('error', err.errors[0].longMessage)
          alert("Something went wrong with resetting your password.")
          router.push("/")
        })
    }

    // Reset user password. Upon successful reset, the user will be signed in and redirected to the home page
    async function reset(e) {
      e.preventDefault()

      if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
        setError('Invalid password. Try again');
        setErrorBG('error');
        resetFields();
      } else if (password !== confirmPassword) {
        setError('Passwords don\'t match. Try again.');
        setErrorBG('error');
        resetFields();
      } else {
        await signIn
          ?.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code,
            password,
          })
          .then((result) => {
            setActive({ session: result.createdSessionId })
            router.push("/login")
          })
          .catch((err) => {
            setError('Invalid code. Try again.');
            setErrorBG('error');
            resetFields();
          })
      }
    }

    return (
      <>
        {!successfulCreation && (
          <div className="login-bg">
            <div className="reset-password-container">
              <div className="back-to-login" onClick={() => {router.push("/login")}}>&lt; Back to Login</div>
              <div className="titleContainer">
                <div className="SMLogo sm-logo-small">
                  <Image src="/SM_LOGO.svg" alt="No image found" fill />
                </div>
                <div className="clothing-database-small">CLOTHING DATABASE</div>
              </div>
              <div className="reset-password-text">
                <div className="password-text-larger">Reset Password</div>
                <div>Please input the email the account is associated with.</div>
              </div>
              <div className="inputContainer">
                <input
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputBox"
                />
              </div>
              <div className="inputContainer bottom">
                <input 
                  className="inputButton" 
                  type="button" 
                  value="Reset Password"
                  onClick={create}
                />
              </div>
            </div>
          </div>
        )}

        {successfulCreation && (
          <div className="login-bg">
            <div className="reset-password-container">
              <div className="reset-password-text">
                <div className="password-text-larger">Reset Password</div>
                <div>A code to reset your password has been sent to your email. Enter it and your new password to reset your password.</div>
              </div>
              <div className={errorBG}>{error}</div>
              <div className="inputContainer">
                <input
                  value={code}
                  placeholder="Reset Password Code"
                  onChange={(e) => setCode(e.target.value)}
                  className="inputBox"
                />
              </div>
              <div className="inputContainer">
                <input
                  value={password}
                  placeholder="New Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputBox"
                />
              </div>
              <div className="inputContainer">
                <input
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="inputBox"
                  type="password"
                />
              </div>
              <div className='inputContainer'>
                <input 
                  className='inputButton' 
                  type="button" 
                  onClick={reset} 
                  value='Reset Password'
                />
              </div>
            </div>
          </div>
        )}
      </>
    )    
}