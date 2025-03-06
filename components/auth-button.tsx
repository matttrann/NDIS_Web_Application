"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();  // This should be client-side
  
  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>
  }
  return <button onClick={() => signIn()}>Sign in</button>
} 