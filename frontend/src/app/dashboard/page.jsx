/**
 * @fileoverview Contains dummy dashboard landing page. Only important thing is log out button
 * 
 * @file dashboard/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

"use client";

import "../app.css"
import { useClerk } from '@clerk/nextjs'

export default function Dashboard() {
  const { signOut } = useClerk();

  return (
    <div>
      <div className="login-bg">
        <div className="mainContainer">
          Dashboard
          <div className="inputContainer">
            <input 
              className="inputButton" 
              type="button" 
              value="Log out"
              onClick={() => signOut({ redirectUrl: '/' })}  // If not signed in, clicking wont do anything 
            />
          </div>
        </div>
      </div>
    </div>

  );
}