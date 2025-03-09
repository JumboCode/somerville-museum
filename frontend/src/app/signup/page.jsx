'use client';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Feather icons
import { useSignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../app.css';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passType, setPassType] = useState('password');
  const [confirmPassType, setConfirmPassType] = useState('password');
  const [error, setError] = useState('');
  const [errorBG, setErrorBG] = useState('#FFFFFF');
  const [errorBorder, setErrorBorder] = useState('#9B525F');
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');

  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  if (isSignedIn) {
    router.push('/dashboard');
  }

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleCreateError = () => {
    setErrorBG(errorBG === '#FFFFFF' ? 'rgba(255, 44, 44, 0.2)' : '#FFFFFF');
    setErrorBorder(errorBorder === '#9B525F' ? 'red' : '#9B525F');
  };

  function containsUppercaseAndSymbol(str) {
    const hasUppercase = /[A-Z]/.test(str);
    const hasSymbol = /[^a-zA-Z0-9]/.test(str);
    return hasUppercase && hasSymbol;
  }

  const handlePassToggle = () => {
    setPassType(passType === 'password' ? 'text' : 'password');
  };

  const handleConfirmPassToggle = () => {
    setConfirmPassType(confirmPassType === 'password' ? 'text' : 'password');
  };

  const onButtonClick = () => {
    setError('');

    if (firstName === '' || lastName === '') {
      setError('Please enter your name.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (email === '') {
      setError('Please enter your email.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (password === '') {
      setError('Please enter a password.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
      setError('Invalid password.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (confirmPassword === '') {
      setError('Please confirm your password.');
      handleCreateError();
      resetFields();
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      handleCreateError();
      resetFields();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onButtonClick()) {
      return;
    }

    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setVerifying(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push('/dashboard');
      } else {
        alert('Invalid verification code. Try again.');
      }
    } catch (err) {
      alert('Invalid verification code. Try again.');
    }
  };

  if (verifying) {
    return (
      <div className="login-bg">
        <div className="confirmContainer">
          <div className="reset-password-text">
            <div className="password-text-larger">Thank you for signing up!</div>
            <div>Please enter the verification code sent to your email below.</div>
          </div>
          <div className="inputContainer">
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
              value={'Sign Up'}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg">
      <div className="mainContainer">
        <div className="back-to-login" onClick={() => router.push('/login')}>
          &lt; Back to Login
        </div>
        <div className="titleContainer logo-shrink">
          <div className="SMLogo sm-logo-small">
            <Image src="/SM_LOGO.svg" alt="No image found" fill />
          </div>
          <div className="clothing-database-small">CLOTHING DATABASE</div>
        </div>
        <div className={'namesContainer'}>
          <div className={'inputContainer'}>
            <label className="errorLabel" style={{ backgroundColor: errorBG }}>
              {error}
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
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderColor: errorBorder }}
          />
          <span className={'eyecon'} onClick={handlePassToggle}>
            {passType === 'password' ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
            {confirmPassType === 'password' ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>
        <div className={'passwordInfo'}>
          <p className={'passwordInfoP'}>Password must contain the following:</p>
          <p className={'passwordInfoP'}>- 1 Uppercase character</p>
          <p className={'passwordInfoP'}>- 1 Special character - !&quot;$%@#</p>
          <p className={'passwordInfoP'}>- Must be longer than 8 characters</p>
        </div>
        <div className={'inputContainer'}>
          <input
            className={'inputButton'}
            type="button"
            onClick={handleSubmit}
            value={'Sign Up'}
          />
        </div>
      </div>
    </div>
  );
}