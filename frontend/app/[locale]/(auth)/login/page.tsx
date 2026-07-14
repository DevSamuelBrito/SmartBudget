import { Suspense } from "react"

import { LoginCard } from "./components/login-card"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </div>
  )
}
