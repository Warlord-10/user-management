"use client";
import { SessionProvider } from "next-auth/react";


function AuthProvidor({session, children}) {
  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
  )
}

export default AuthProvidor