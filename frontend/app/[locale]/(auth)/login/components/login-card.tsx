"use client";

// React
import { useState } from "react";

// next
import { useSearchParams } from "next/navigation";

// Components
import { LoginFormSide } from "./login-form-side";

import { RegisterFormSide } from "./register-form-side";

export function LoginCard() {
  const searchParams = useSearchParams();

  const [isFlipped, setIsFlipped] = useState(searchParams.get("mode") === "register");

  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <div className="[perspective:1400px]">
        <div
          className={`relative min-h-[430px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
            <LoginFormSide onSignUpClick={() => setIsFlipped(true)} />
          </div>

          <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <RegisterFormSide onBackToLogin={() => setIsFlipped(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}