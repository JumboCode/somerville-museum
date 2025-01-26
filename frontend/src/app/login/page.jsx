"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import Checkbox from "../components/Checkbox";
import "../app.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [error, setError] = useState("");
  const [errorBG, setErrorBG] = useState("#FFFFFF");
  const [errorBorder, setErrorBorder] = useState("#9B525F");
  const [loginAttempts, setLoginAttempts] = useState(0);

  const router = useRouter();

  const handleToggle = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(type === "password" ? eye : eyeOff);
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLoginError = () => {
    setErrorBG("rgba(255, 44, 44, 0.2)");
    setErrorBorder("red");
  };

  const typeEmail = (e) => {
    setEmail(e.target.value);
    setErrorBG("#FFFFFF");
    setErrorBorder("#9B525F");
    setError("");
  };

  const typePassword = (e) => {
    setPassword(e.target.value);
    setErrorBG("#FFFFFF");
    setErrorBorder("#9B525F");
    setError("");
  }

  const onButtonClick = () => {
    setLoginAttempts(loginAttempts + 1);

    setError("");

    if (!email) {
      setError("Please enter your email.");
      handleLoginError();
      resetFields();
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Please enter a valid email.");
      handleLoginError();
      resetFields();
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      handleLoginError();
      resetFields();
      return;
    }

    if (password.length < 9 || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      setError("Invalid password.");
      handleLoginError();
      resetFields();
      return;
    }

    checkAccountExists((accountExists) => {
      if (accountExists) logIn();
      else {
        setError("Invalid email or password.");
        handleLoginError();
        resetFields();
      }
    });
  };

  const checkAccountExists = (callback) => {
    fetch("http://localhost:3080/check-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((res) => callback(res?.userExists));
  };

  const logIn = () => {
    fetch("http://localhost:3080/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "success") {
          localStorage.setItem("user", JSON.stringify({ email, token: res.token }));
          router.push("/dashboard");  // We are not creating dashboard it is already created on another sprint - Ari & Shayne
        } else {
          setError("Email or password is invalid.");
          resetFields();
        }
      });
  };

  if (loginAttempts >= 5) {
    router.push("/");
  }

  return (
    <div className="login-bg">
      <div className="mainContainer">
        <div className="titleContainer">
          <div className="SMLogo">Somerville Museum</div>
        </div>
        <div className="inputContainer">
          <label className="errorLabel" style={{ backgroundColor: errorBG }}>
            {error}
          </label>
          <input
            value={email}
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
          <span className="eyecon" onClick={handleToggle}>
            <Icon icon={icon} size={20} />
          </span>
        </div>
        <div className="remember-pwd">
          <Checkbox className="check" label="Remember me" />
          <button className="textButton" onClick={() => router.push("/forgot_password")}>
            <strong>
              <p className="tiny">Forgot password?</p>
            </strong>
          </button>
        </div>
        <div className="inputContainer login-button">
          <input className="inputButton" type="button" onClick={onButtonClick} value="Login" />
        </div>
        <div className="create-account">
          <div>Don't have an account?</div>
          <button className="textButton" onClick={() => router.push("/create_account")}>
            <strong>Create an account</strong>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;