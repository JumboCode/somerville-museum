/**
 * @fileoverview Contains layout and logic for the login page with a custom clerk flow.
 * 
 * @file login/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useAuth } from "@clerk/nextjs";
import Eyecon from "../components/Eyecon";
import EyeconOff from "../components/EyeconOff";
import Checkbox from "../components/Checkbox";
import Image from "next/image";
import "../app.css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [eyeColor, setEyeColor] = useState("#9B525F");
  const [error, setError] = useState("");
  const [errorBG, setErrorBG] = useState("#FFFFFF");
  const [errorBorder, setErrorBorder] = useState("#9B525F");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  const handlePassToggle = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLoginError = () => {
    setErrorBG("rgba(255, 44, 44, 0.2)");
    setErrorBorder("red");
    setEyeColor(eyeColor === "#9B525F" ? "red" : "#9B525F");
  };

  const typeEmail = (e) => {
    setEmail(e.target.value);
    setErrorBG("#FFFFFF");
    setErrorBorder("#9B525F");
    setError("");
    setEyeColor("#9B525F");
  };

  const typePassword = (e) => {
    setPassword(e.target.value);
    setErrorBG("#FFFFFF");
    setErrorBorder("#9B525F");
    setError("");
    setEyeColor("#9B525F");
  };

  const onButtonClick = () => {
    setLoginAttempts(loginAttempts + 1);
    setError("");

    if (loginAttempts >= 5) {
      router.push("/");
    }

    if (!email) {
      setError("Please enter your email.");
      handleLoginError();
      resetFields();
      return false;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Please enter a valid email.");
      handleLoginError();
      resetFields();
      return false;
    }

    if (!password) {
      setError("Please enter a password.");
      handleLoginError();
      resetFields();
      return false;
    }

    return true;
  };

  const signInWithEmail = async () => {
    if (!onButtonClick()) return;
  
    console.log("Attempting sign in with:", email, password);
    console.log("Remember Me checked:", rememberMe);
  
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        console.log("Login successful. Storing to localStorage...");
  
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          console.log("✅ Saved email and password to localStorage.");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          console.log("🧹 Cleared localStorage.");
        }
  
        await setActive({ session: result.createdSessionId });
        router.push("/login_confirmed");
      } else {
        console.log("Sign in not complete yet:", result);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      handleLoginError();
      resetFields();
    }
  };
  

  return (
    <div className="login-bg">
      <div className="mainContainer">
        <div className="titleContainer">
          <div className="SMLogo sm-logo-large">
            <Image src="/SM_LOGO.svg" alt="No image found" fill />
          </div>
          <div className="clothing-database">CLOTHING DATABASE</div>
        </div>
        <div className="inputContainer">
          <label
            className="errorLabel"
            style={{
              backgroundColor: error ? "rgba(255, 44, 44, 0.2)" : "#FFFFFF",
              minHeight: "24px",
              color: error ? "red" : "#FFFFFF",
              padding: "4px 8px",
              display: "block",
              transition: "all 0.2s ease",
            }}
          >
            {error || ""}
          </label>

          <input
            value={email}
            name="email"
            placeholder="Email"
            onChange={typeEmail}
            className="inputBox"
            style={{ borderColor: errorBorder }}
          />
        </div>
        <div className="inputContainer password">
          <input
            value={password}
            name="password"
            type={type}
            placeholder="Password"
            onChange={typePassword}
            className="inputBox"
            style={{ borderColor: errorBorder }}
            autoComplete="current-password"
          />
          <span className={"eyecon"} onClick={handlePassToggle}>
            {type === "password" ? (
              <EyeconOff color={eyeColor} />
            ) : (
              <Eyecon color={eyeColor} />
            )}
          </span>
        </div>
        <div className="remember-pwd">
          <Checkbox
            className="check"
            label="Remember me"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
          />
          <button
            className="textButton"
            onClick={() => router.push("/reset_password")}
          >
            <strong>
              <p className="tiny">Forgot password?</p>
            </strong>
          </button>
        </div>
        <div className="inputContainer login-button">
          <input
            className="inputButton"
            type="button"
            onClick={signInWithEmail}
            value="Login"
          />
        </div>
        <div className="create-account">
          <div>Don&apos;t have an account?</div>
          <button
            className="textButton"
            onClick={() => router.push("/signup")}
          >
            <strong>Create an account</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
