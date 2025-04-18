"use client";

import "./app.css"
import "./globals.css"
import Image from "next/image";
import { useRouter } from 'next/navigation';

const App = () => {
  const router = useRouter();

  return (
    <div className={'login-bg'}>
      <div className="mainContainer">
        
        <div className="titleContainer">
          <div className="SMLogo sm-logo-large">
            <Image src="/SM_LOGO.svg" alt="No image found" fill />
          </div>
          <div className="clothing-database">CLOTHING DATABASE</div>
        </div>

        <div className={'buttonContainer'}>
          <input
            className={'inputButton'}
            type="button"
            onClick={() => router.push('/login')}
            value='Log in'
          />
        </div>
      </div>
    </div>
  );
};

export default App;
