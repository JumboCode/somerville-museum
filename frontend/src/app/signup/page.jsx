'use client'

import { useState, useEffect } from 'react'
import { useSignUp, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Eyecon from "../components/Eyecon";
import EyeconOff from "../components/EyeconOff";
import "../app.css"

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passType, setPassType] = useState('password');
  const [eyeColor, setEyeColor] = useState('#9B525F');
  const [error, setError] = useState('');
  const [errorBG, setErrorBG] = useState('#FFFFFF');
  const [errorBorder, setErrorBorder] = useState('#9B525F');
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, []);

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const handleCreateError = () => {
    setErrorBG(errorBG === '#FFFFFF' ? 'rgba(255, 44, 44, 0.2)' : '#FFFFFF');
    setErrorBorder(errorBorder === '#9B525F' ? 'red' : '#9B525F');
    setEyeColor(eyeColor === '#9B525F' ? 'red' : '#9B525F');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setHasUppercase(/[A-Z]/.test(value));
    setHasSpecialChar(/[^a-zA-Z0-9]/.test(value));
    setIsLongEnough(value.length > 8);
  };

  const handlePassToggle = () => {
    setPassType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const onButtonClick = () => {
    setError('');

    if ('' === firstName || '' === lastName) {
      setError('Please enter your name.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if ('' === email) {
      setError('Please enter your email.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if ('' === password) {
      setError('Please enter a password.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if (!isLongEnough || !hasUppercase || !hasSpecialChar) {
      setError('Invalid password.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if ('' === confirmPassword) {
      setError('Please confirm your password.');
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      if (errorBG === '#FFFFFF') handleCreateError();
      resetFields();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!onButtonClick()) return;
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      })
      

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })
      setVerifying(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push('/signup_confirmed');
      } else {
        alert("Invalid verification code. Try again.");
      }
    } catch (err) {
      alert("Invalid verification code. Try again.");
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
            <label
              className="errorLabel"
              style={{
                backgroundColor: error ? "rgba(255, 44, 44, 0.2)" : "#FFFFFF",
                minHeight: "24px",
                color: error ? "red" : "#FFFFFF",
                padding: "4px 8px",
                display: "block",
                transition: "all 0.2s ease",
              }}
            >
              {error || "‎"}
            </label>
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
            onChange={handlePasswordChange}
            style={{ borderColor: errorBorder }}
          />
          <span className={'eyecon'} onClick={handlePassToggle}>
            {passType === 'password' ? <EyeconOff color={eyeColor} /> : <Eyecon color={eyeColor} />}
          </span>
        </div>
        <div className="inputContainer password">
          <input
            id="Confirm Password"
            type="password"
            name="Confirm Password"
            placeholder="Confirm Password"
            value={confirmPassword}
            className="inputBox"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ borderColor: errorBorder }}
          />
        </div>
        <div className={'passwordInfo'}>
          <p className={'passwordInfoP'}>Password must contain the following:</p>
          <p className={'passwordInfoP'} style={{ color: hasUppercase ? 'green' : 'black' }}>- 1 Uppercase character</p>
          <p className={'passwordInfoP'} style={{ color: hasSpecialChar ? 'green' : 'black' }}>- 1 Special character - !"$%@#</p>
          <p className={'passwordInfoP'} style={{ color: isLongEnough ? 'green' : 'black' }}>- Must be longer than 8 characters</p>
        </div>
        <div className={'inputContainer'}>
          <input className={'inputButton'} type="button" onClick={handleSubmit} value={'Sign Up'} />
        </div>
      </div>
    </div>
  )
}
