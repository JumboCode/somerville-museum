//   return (
//     <div className={'login-bg'}>
//       <div className={'mainContainer'}>
//         <div className={'titleContainer logo-shrink'}>
//           <div className={'SMLogo'}></div>
//           <div className="clothing-database">CLOTHING DATABASE</div>
//         </div>
//         <div className={'namesContainer'}>
//           <div className={'inputContainer'}>
//             <label className="errorLabel" style={{ backgroundColor: errorBG }}>{error}</label>
//             <input
//               value={firstName}
//               placeholder="First Name"
//               onChange={(ev) => setFirstName(ev.target.value)}
//               className={'names'}
//               style={{ borderColor: errorBorder }}
//             />
//           </div>
//           <div className={'inputContainer'}>
//             <input
//               value={lastName}
//               placeholder="Last Name"
//               onChange={(ev) => setLastName(ev.target.value)}
//               className={'names'}
//               style={{ borderColor: errorBorder }}
//             />
//           </div>
//         </div>
//         <div className={'inputContainer'}>
//           <input
//             value={email}
//             placeholder="Email"
//             onChange={(ev) => setEmail(ev.target.value)}
//             className={'inputBox'}
//             style={{ borderColor: errorBorder }}
//           />
//         </div>
//         <div className={'inputContainer password'}>
//           <input
//             value={password}
//             name="password"
//             type={passType}
//             placeholder="Password"
//             onChange={(ev) => setPassword(ev.target.value)}
//             className={'inputBox'}
//             style={{ borderColor: errorBorder }}
//             autoComplete="current-password"
//           />
//           <span className={'eyecon'} onClick={handlePassToggle}>
//             <Icon icon={passIcon} size={20} />
//           </span>
//         </div>
//         <div className={'inputContainer password'}>
//           <input
//             value={confirmPassword}
//             name="confirmPassword"
//             type={confirmPassType}
//             placeholder="Confirm Password"
//             onChange={(ev) => setConfirmPassword(ev.target.value)}
//             className={'inputBox'}
//             style={{ borderColor: errorBorder }}
//           />
//           <span className={'eyecon'} onClick={handleConfirmPassToggle}>
//             <Icon icon={confirmPassIcon} size={20} />
//           </span>
//         </div>
//         <div className={'passwordInfo'}>
//           <p className={'passwordInfoP'}>Password must contain the following:</p>
//           <p className={'passwordInfoP'}>- 1 Uppercase character</p>
//           <p className={'passwordInfoP'}>- 1 Special character - !"$%@#</p>
//           <p className={'passwordInfoP'}>- Must be longer than 8 characters</p>
//         </div>

//         <div className={'inputContainer'}>
//           <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Sign Up'} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAccount;

'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import "../app.css"

export default function CreateAccout() {
  const { isLoaded, signUp, setActive } = useSignUp()
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
  const router = useRouter()

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
  };

  function containsUppercaseAndSymbol(str) {
    const hasUppercase = /[A-Z]/.test(str); // Check for uppercase letters
    const hasSymbol = /[^a-zA-Z0-9]/.test(str); // Check for symbols (non-alphanumeric characters)
    return hasUppercase && hasSymbol;
  }

  const handlePassToggle = () => {
    if (passType === 'password') {
      setPassIcon(eye);
      setPassType('text');
    } else {
      setPassIcon(eyeOff);
      setPassType('password');
    }
  };

  const handleConfirmPassToggle = () => {
    if (confirmPassType === 'password') {
      setConfirmPassIcon(eye);
      setConfirmPassType('text');
    } else {
      setConfirmPassIcon(eyeOff);
      setConfirmPassType('password');
    }
  };

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
        strategy: "",
      })

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
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

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.push('/')
      } else {
        
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2))
    }
  }

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification code</label>
          <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
          <button type="submit">Verify</button>
        </form>
      </>
    )
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <div className="login-bg">
      <div className="mainContainer">
        <div className="titleContainer logo-shrink">
          <div className="SMLogo"></div>
          <div className="clothing-database">CLOTHING DATABASE</div>
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