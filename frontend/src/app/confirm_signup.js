// users will be redirected to this page after a successful login attempt
"use client";

import './login.css';
import { useNavigate } from 'react-router-dom'; 

export default function ConfirmSignup () {
    const onButtonClick = () => {
        navigate('/login')
    }

    const navigate = useNavigate()

    return (
    <div className={'login-bg'}>
        <div className="confirmContainer">
            <div className={'titleContainer'}>
                <div>Thank you for signing up!</div>
            </div>
            <div className={'bodyContainer'}>Please check your email<br></br>to confirm your account</div>
            <div className={'buttonContainer'}>
        <input
          className={'returnButton'}
          type="button"
          onClick={onButtonClick}
          value={'Back to Login'}
        />
      </div>
        </div>
    </div>
    )
}