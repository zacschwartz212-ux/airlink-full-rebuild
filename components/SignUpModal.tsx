// components/SignUpModal.tsx
"use client"

import { useEffect } from "react"
import { openAuth } from "./AuthModal"

export default function SignUpModal() {
  // This component no longer renders its own modal.
  // It simply exposes the ability to open the unified AuthModal in signup mode if needed.
  useEffect(() => {
    // noop
  }, [])
  return null
}

// If you want to open signup from anywhere:
// openAuth("signup")
