"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../app.css'
import 'dotenv/config'

export default function forgot_password () {
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [stage, setStage] = useState("request"); // "request" -> "verify" -> "reset"

    const router = useRouter()

    return (
        <div className="login-bg">
          <div className="forgot-password-container">
            <div className="titleContainer logo-shrink">
              <div className="SMLogo"></div>
              <div className="clothing-database">CLOTHING DATABASE</div>
            </div>
            <div className="forgot-password-text">
              <div className="password-text-larger">Forgot Password</div>
              <div>Please input the email the account is associated with</div>
            </div>
            <br />
            <div className="inputContainer">
              <input
                value={email}
                placeholder="Email"
                onChange={(e) => {setEmail(e.target.value)}}
                className={'inputBox'}
              />
            </div>
            <div className="inputContainer ">
              <input 
                className="inputButton" 
                type="button" 
                value="Reset Password"
                onClick={checkAccount}
              />
            </div>
          </div>
        </div>
    )
}