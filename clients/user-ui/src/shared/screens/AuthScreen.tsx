"use client";
import React, { ReactNode, useState } from "react";
import Login from "../view/Login";
import Register from "../view/Register";
import Verification from "../view/Verification";

const AuthScreen = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
  const [activeState, setActiveState] = useState("Login");
  console.log(setOpen, "l..................");
  return (
    <div>
      {activeState === "Login" && (
        <Login close={setOpen} setActiveState={setActiveState} />
      )}
      {activeState === "Signup" && <Register setActiveState={setActiveState} />}
      {activeState === "Verification" && (
        <Verification setActiveState={setActiveState} />
      )}
    </div>
  );
};

export default AuthScreen;
