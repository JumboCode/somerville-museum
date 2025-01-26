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
        <div className={'titleContainer'}>
          <div>Thank you for signing up!</div>
        </div>
        <div className={'bodyContainer'}>
          Please check your email<br />to confirm your account
        </div>
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
