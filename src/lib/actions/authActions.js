
import { signIn, signOut } from "next-auth/react"

export const loginWithGoogle = async () => {
    await signIn("google", {redirectTo: "/dashboard"})
}

export const loginWithGithub = async () => {
    await signIn("github", {redirectTo: "/dashboard"})
}

export const logout = async () => {
    await signOut({callbackUrl: "/login"})
}