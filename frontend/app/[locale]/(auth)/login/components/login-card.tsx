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
      <div className="perspective-[1400px]">
        <div
          className={`grid w-full transform-3d transition-transform duration-700 ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          <div className="col-start-1 row-start-1 backface-hidden">
            <LoginFormSide onSignUpClick={() => setIsFlipped(true)} />
          </div>

          <div className="col-start-1 row-start-1 backface-hidden transform-[rotateY(180deg)]">
            <RegisterFormSide onBackToLogin={() => setIsFlipped(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}