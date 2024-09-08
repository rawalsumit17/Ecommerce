import React, { useState, useRef } from "react";
import "./CSS/LoginSignup.css";

function LoginSignup() {
  const [loginorSignup, setLoginorSignup] = useState("Login");
  const refuserName = useRef("");
  const refPassword = useRef("");
  const refEmail = useRef("");

  const login = async () => {
    const loginData = {
      password: refPassword.current.value,
      email: refEmail.current.value,
    };
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("auth-token", data.token);
          window.location.replace("/");
        } else {
          alert(data.error);
        }
      });
  };
  const signup = async () => {
    const signUpData = {
      username: refuserName.current.value,
      password: refPassword.current.value,
      email: refEmail.current.value,
    };

    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("auth-token", data.token);
          window.location.replace("/login");
        } else {
          alert(data.error);
        }
      });
  };
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{loginorSignup}</h1>
        <div className="loginsignup-fields">
          {loginorSignup === "Login" ? (
            <></>
          ) : (
            <input
              ref={refuserName}
              type="text"
              name="username"
              placeholder="Your Name"
            />
          )}
          <input
            ref={refEmail}
            type="email"
            name="email"
            placeholder="Email Address"
          />
          <input
            ref={refPassword}
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            loginorSignup === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {loginorSignup === "Login" ? (
          <p className="loginsignup-login">
            Create an Account?{" "}
            <span onClick={() => setLoginorSignup("Sign Up")}>Sign UP</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setLoginorSignup("Login")}>Login here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
