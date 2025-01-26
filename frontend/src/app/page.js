"use client";

import "./app.css"
import "./globals.css"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const App = () => {
  const router = useRouter();

  return (
    <div className={'login-bg'}>
      <div className="mainContainer">
        <div className={'titleContainer'}>
          <div>Somerville Museum</div>
        </div>
        <div>Database</div>
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