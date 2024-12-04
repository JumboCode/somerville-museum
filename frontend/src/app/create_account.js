// users will be redirected to this page after clicking "create account" link on login page
"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import './login.css';

const CreateAccount = (props) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passType, setPassType] = useState('password');
    const [confirmPassType, setConfirmPassType] = useState('password');
    const [passIcon, setPassIcon] = useState(eyeOff);
    const [confirmPassIcon, setConfirmPassIcon] = useState(eyeOff);
    const [error, setError] = useState('')
    const [errorBG, setErrorBG] = useState('#FFFFFF')
    const [errorBorder, setErrorBorder] = useState('#9B525F')

    const navigate = useNavigate()

    function resetFields() {
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('') 
    }
    
    const handleCreateError = () => {  // Displaying error messages and turning border red
        setErrorBG(errorBG === '#FFFFFF' ? 'rgba(255, 44, 44, 0.2)' : '#FFFFFF')
        setErrorBorder(errorBorder === '#9B525F' ? 'red' : '#9B525F')
    }

    function containsUppercaseAndSymbol(str) {
        const hasUppercase = /[A-Z]/.test(str);  // Check for uppercase letters
        const hasSymbol = /[^a-zA-Z0-9]/.test(str);  // Check for symbols (non-alphanumeric characters)
        return hasUppercase && hasSymbol;
    }

    const handlePassToggle = () => {
        if (passType==='password'){
            setPassIcon(eye);
            setPassType('text')
        } else {
            setPassIcon(eyeOff)
            setPassType('password')
        }
    }

    const handleConfirmPassToggle = () => {
        if (confirmPassType==='password'){
            setConfirmPassIcon(eye);
            setConfirmPassType('text')
        } else {
            setConfirmPassIcon(eyeOff)
            setConfirmPassType('password')
        }
    }

    const onButtonClick = () => {
        // Set initial error values to empty
        setError('')
    
        // Check if the user has entered fields correctly
        if ('' === firstName || '' === lastName) {
            setError('Please enter your name.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return 
        }

        if ('' === email) {
            setError('Please enter your email.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return
        }
    
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setError('Please enter a valid email.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return
        }
    
        if ('' === password) {
            setError('Please enter a password.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return
        }
    
        if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
            setError('Invalid password.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return
        }

        if ('' === confirmPassword) {
            setError('Please confirm your password.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords don\'t match.')
            if (errorBG === '#FFFFFF') {
                handleCreateError()
            }
            resetFields()
            return 
        }
    
        // Check if email has an account associated with it
        checkAccountExists((accountExists) => {
            // If yes, log in
            if (accountExists) {
                setError('Account with that email already exists')
                if (errorBG === '#FFFFFF') {
                    handleCreateError()
                }
                resetFields()
                return  
            } else {
                createAcc()
            }
        })
    }

// Call the server API to check if the given email ID already exists
const checkAccountExists = (callback) => {
    fetch('http://localhost:3080/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }
  
  // Log in a user using email and password
  const createAcc = () => {
    fetch('http://localhost:3080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if ('success' === r.message) {
          localStorage.setItem('user', JSON.stringify({ email, token: r.token }))
          navigate('/login')
        } else {
          setError('Something went wrong with creating your account. Try again')
          resetFields()
        }
      })
    }

    return (
        <div className={'login-bg'}>
            <div className={'mainContainer'}>
                <div className={'titleContainer'}>
                    <div className={'SMLogo'}>Somerville Museum</div>
                </div>
                <br />
                  <div className={'namesContainer'}>
                    <div className={'inputContainer'}>
                        <label className="errorLabel" style={{backgroundColor: errorBG}}>{error}</label>
                        <input
                            value={firstName}
                            placeholder="First Name"
                            onChange={(ev) => setFirstName(ev.target.value)}
                            className={'names'}
                            style={{borderColor: errorBorder}}
                        /> 
                    </div>
                    <div className={'inputContainer'}>
                        <input
                            value={lastName}
                            placeholder="Last Name"
                            onChange={(ev) => setLastName(ev.target.value)}
                            className={'names'}
                            style={{borderColor: errorBorder}}
                        /> 
                    </div>
                  </div>
                <div className={'inputContainer'}>
                    <input
                        value={email}
                        placeholder="Email"
                        onChange={(ev) => setEmail(ev.target.value)}
                        className={'inputBox'}
                        style={{borderColor: errorBorder}}
                    />
                </div>
                <div className={'inputContainer password'}>
                    <input
                        value={password}
                        name="password"
                        type={passType}
                        placeholder="Password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className={'inputBox'}
                        style={{borderColor: errorBorder}}
                        autoComplete="current-password"
                    />
                    <span className={'eyecon'} onClick={handlePassToggle}>
                        <Icon icon={passIcon} size={20}/>
                    </span>
                </div>
                <div className={'inputContainer password'}>
                    <input
                        value={confirmPassword}
                        name="confirmPassword"
                        type={confirmPassType}
                        placeholder="Confirm Password"
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                        className={'inputBox'}
                        style={{borderColor: errorBorder}}
                    />
                    <span className={'eyecon'} onClick={handleConfirmPassToggle}>
                        <Icon icon={confirmPassIcon} size={20}/>
                    </span>
                    <div className={'passwordInfo'}>
                        <p className={'passwordInfoP'}>Password must contain the following:</p>
                        <p className={'passwordInfoP'}>- 1 Uppercase character</p>
                        <p className={'passwordInfoP'}>- 1 Special character - !"$%@#</p>
                        <p className={'passwordInfoP'}>- Must be longer than 8 characters</p>
                    </div>
                </div>
                
                <div className={'inputContainer'}>
                    <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Sign Up'} />
                </div>
            </div>
        </div>
    );
}

export default CreateAccount