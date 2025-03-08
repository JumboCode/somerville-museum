/**
 * @fileoverview Contains layout and logic for the signup page with a custom clerk flow.
 * 
 * @file signup/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

'use client'

import { useState } from 'react'
import { useSignUp, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import Image from "next/image";
import "../app.css"

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passType, setPassType] = useState('password');
  const [confirmPassType, setConfirmPassType] = useState('password');
  const [passIcon, setPassIcon] = useState(eyeOff);
  const [confirmPassIcon, setConfirmPassIcon] = useState(eyeOff);
  const [error, setError] = useState('');
  const [errorBG, setErrorBG] = useState('#FFFFFF');
  const [errorBorder, setErrorBorder] = useState('#9B525F');
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useAuth();
  const router = useRouter()

  if (isSignedIn) {
    router.push('/dashboard')
  }

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const handleCreateError = () => {  // Make everything red when sign up error
    setErrorBG(errorBG === '#FFFFFF' ? 'rgba(255, 44, 44, 0.2)' : '#FFFFFF');
    setErrorBorder(errorBorder === '#9B525F' ? 'red' : '#9B525F');
  };

  function containsUppercaseAndSymbol(str) {  // Validate password
    const hasUppercase = /[A-Z]/.test(str); // Check for uppercase letters
    const hasSymbol = /[^a-zA-Z0-9]/.test(str); // Check for symbols (non-alphanumeric characters)
    return hasUppercase && hasSymbol;
  }

  const handlePassToggle = () => {  // Toggle between showing passwords
    if (passType === 'password') {
      setPassIcon(eye);
      setPassType('text');
    } else {
      setPassIcon(eyeOff);
      setPassType('password');
    }
  };

  const handleConfirmPassToggle = () => {  // Toggle between showing passwords
    if (confirmPassType === 'password') {
      setConfirmPassIcon(eye);
      setConfirmPassType('text');
    } else {
      setConfirmPassIcon(eyeOff);
      setConfirmPassType('password');
    }
  };

  // Handle validation of names, email, and password
  const onButtonClick = () => {
    // Set initial error values to empty
    setError('');

    // Check if the user has entered fields correctly
    if ('' === firstName || '' === lastName) {
      setError('Please enter your name.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if ('' === email) {
      setError('Please enter your email.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if ('' === password) {
      setError('Please enter a password.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
      setError('Invalid password.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if ('' === confirmPassword) {
      setError('Please confirm your password.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      if (errorBG === '#FFFFFF') {
        handleCreateError();
      }
      resetFields();
      return false;
    }

    return true;
  };

  // Handle submission of the sign-up form
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!onButtonClick()) {
      return;
    }

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      })

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })
      setVerifying(true)
    } catch (err) {
      console.error(err)
    }
  }

  // Handle the submission of the verification form
  const handleVerify = async (e) => {
    e.preventDefault()

    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.push('/dashboard')
      } else {
        alert("Invalid verification code. Try again.")
      }
    } catch (err) {
      alert("Invalid verification code. Try again.")
    }
  }

  if (verifying) {
    return (
      <div className="login-bg">
        <div className="confirmContainer">
          <div className="reset-password-text">
            <div className="password-text-larger">Thank you for signing up!</div>
            <div>Please enter the verification code sent to your email below.</div>
          </div>
          <div className='inputContainer'>
            <input
              value={code}
              placeholder="Verification Code"
              onChange={(e) => setCode(e.target.value)}
              className={'inputBox'}
            />
          </div>
          <div className={'inputContainer'}>
            <input 
              className={'inputButton'} 
              type="button" 
              onClick={handleVerify} 
              value={'Sign Up'} />
          </div>
        </div>
      </div>
    )
  }

  // Sign-up form to capture email, password, name, etc.
  return (
    <div className="login-bg">
      <div className="mainContainer">
        <div className="back-to-login" onClick={() => {router.push("/login")}}>&lt; Back to Login</div>
        <div className="titleContainer logo-shrink">
          <div className="SMLogo sm-logo-small">
            <Image src="/SM_LOGO.svg" alt="No image found" fill />
          </div>
          <div className="clothing-database-small">CLOTHING DATABASE</div>
        </div>
        <div className={'namesContainer'}>
          <div className={'inputContainer'}>
            <label className="errorLabel" style={{ backgroundColor: errorBG }}>{error}</label>
            <input
              value={firstName}
              placeholder="First Name"
              onChange={(ev) => setFirstName(ev.target.value)}
              className={'names'}
              style={{ borderColor: errorBorder }}
            />
          </div>
          <div className={'inputContainer'}>
            <input
              value={lastName}
              placeholder="Last Name"
              onChange={(ev) => setLastName(ev.target.value)}
              className={'names'}
              style={{ borderColor: errorBorder }}
            />
          </div>
        </div>
        <div className="inputContainer">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            className="inputBox"
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: errorBorder }}
          />
        </div>
        <div className="inputContainer password">
          <input
            id="password"
            type={passType}
            name="password"
            placeholder="Password"
            value={password}
            className="inputBox"
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderColor: errorBorder }}
          />
          <span className={'eyecon'} onClick={handlePassToggle}>
            <Icon icon={passIcon} size={20} />
          </span>
        </div>
        <div className="inputContainer password">
          <input
            id="Confirm Password"
            type={confirmPassType}
            name="Confirm Password"
            placeholder="Confirm Password"
            value={confirmPassword}
            className="inputBox"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ borderColor: errorBorder }}
          />
          <span className={'eyecon'} onClick={handleConfirmPassToggle}>
            <Icon icon={confirmPassIcon} size={20} />
          </span>
        </div>
        <div className={'passwordInfo'}>
            <p className={'passwordInfoP'}>Password must contain the following:</p>
            <p className={'passwordInfoP'}>- 1 Uppercase character</p>
            <p className={'passwordInfoP'}>- 1 Special character - !"$%@#</p>
            <p className={'passwordInfoP'}>- Must be longer than 8 characters</p>
          </div>
          <div className={'inputContainer'}>
            <input className={'inputButton'} type="button" onClick={handleSubmit} value={'Sign Up'} />
          </div>
      </div>
    </div>
  )
}