"use client";

import '../app.css';
import { useRouter } from 'next/navigation'; 

export default function ConfirmSignup() {
  const router = useRouter();

  const onButtonClick = () => {
    router.push('/login'); // Navigate to the login page
  };

  return (
    <div className={'login-bg'}>
      <div className="confirmContainer">
        <div>Thank you for signing up!</div>
        <br />
        <div className={'bodyConfirmContainer'}>
          Somerville Museum will verify your account. You will receive an email when verified.
        </div>
        <br />
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
  );
}
