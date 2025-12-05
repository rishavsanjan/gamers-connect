'use server'

import { signIn, signOut } from "@/auth"

export const login = async () => {
    await signIn('github', {  callbackUrl: "/?loggedIn=true" })
}

export const logout = async () => {
    await signOut({ redirect:false})
}

export const loginWithGoogle = async () => {
    await signIn('google', {  callbackUrl: "/?loggedIn=true" })
}

