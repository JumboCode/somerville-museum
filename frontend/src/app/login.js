"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import Checkbox from './components/Checkbox';
import './login.css';

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [type, setType] = useState('password')
  const [icon, setIcon] = useState(eyeOff)
  const [error, setError] = useState('')
  const [errorBG, setErrorBG] = useState('#FFFFFF')
  const [errorBorder, setErrorBorder] = useState('#9B525F')
  const [loginAttempts, setLoginAttempts] = useState(0)
  
  const handleLoginError = () => {  // Displaying error messages and turning border red
    setErrorBG(errorBG === '#FFFFFF' ? 'rgba(255, 44, 44, 0.2)' : '#FFFFFF')
    setErrorBorder(errorBorder === '#9B525F' ? 'red' : '#9B525F')
  }

  const handleToggle = () => {
    if (type==='password'){
       setIcon(eye);
       setType('text')
    } else {
       setIcon(eyeOff)
       setType('password')
    }
  }

  const navigate = useNavigate()

  function containsUppercaseAndSymbol(str) {
    const hasUppercase = /[A-Z]/.test(str);  // Check for uppercase letters
    const hasSymbol = /[^a-zA-Z0-9]/.test(str);  // Check for symbols (non-alphanumeric characters)
    return hasUppercase && hasSymbol;
  }

  function resetFields() {
    setEmail('')
    setPassword('')
  }

  const onButtonClick = () => {
    setLoginAttempts(loginAttempts + 1)
    // Set initial error values to empty
    setError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setError('Please enter your email.')
      if (errorBG === '#FFFFFF') {
        handleLoginError()
      }
      resetFields()
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email.')
      if (errorBG === '#FFFFFF') {
        handleLoginError()
      }
      resetFields()
      return
    }
  
    if ('' === password) {
      setError('Please enter a password.')
      if (errorBG === '#FFFFFF') {
        handleLoginError()
      }
      resetFields()
      return
    }
  
    if (password.length < 9 || !containsUppercaseAndSymbol(password)) {
      setError('Invalid password.')
      if (errorBG === '#FFFFFF') {
        handleLoginError()
      }
      resetFields()
      return
    }
  
    // Check if email has an account associated with it
    checkAccountExists((accountExists) => {
        // If yes, log in
        if (accountExists) logIn()
        // Else, ask user if they want to create a new account and if yes, then log in
        else {
            setError('Invalid email or password.')
            if (errorBG === '#FFFFFF') {
                handleLoginError()
            }
            resetFields()
            return
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
  const logIn = () => {
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
          props.setLoggedIn(true)
          props.setEmail(email)
          navigate('/inventory')  
        } else {
          setError('Email or password is invalid.')
          resetFields()
        }
      })
  }

  const createAccount = () => {  // Redirect to /create_account when link is clicked
    navigate('/create_account')
  }

  const forgotPassword = () => {  // Redirect to /forgot_password when link is clicked
    navigate('/forgot_password')
  }

  if (loginAttempts >= 5) {
    navigate('/')  // Change to some other page for a set duration of time
  }

  return (
    <div className={'login-bg'}>
      <div className={'mainContainer'}>
        <div className={'titleContainer'}>
            <div className={'SMLogo'}>Somerville Museum</div>
        </div>
        <br />

        <div className={'inputContainer'}>
          <label className="errorLabel" style={{backgroundColor: errorBG}}>{error}</label>
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
                type={type}
                placeholder="Password"
                onChange={(ev) => setPassword(ev.target.value)}
                className={'inputBox'}
                style={{borderColor: errorBorder}}
                autoComplete="current-password"
            />
            <span className={'eyecon'} onClick={handleToggle}>
                <Icon icon={icon} size={20}/>
            </span>

        </div>
        <div className={'remember-pwd'}>
            <Checkbox className='check' label="Remember me" />
            <button className="textButton" onClick={forgotPassword}>
                <strong><p className='tiny'>Forgot password?</p></strong>
            </button>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Login'} />
        </div>
        <div className={'create-account'}>
            Don't have an account?
            <button className="textButton" onClick={createAccount}>
                <strong>Create an account</strong>
            </button>
        </div>
      </div>
    </div>
  )
}

export default Login