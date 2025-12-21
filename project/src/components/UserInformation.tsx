'use server'

import { auth } from "@/auth"

export const getUserInformation = async () => {
    const session = await auth();
    if (session?.user) {
       return session
    }
    return 'nothiun'
}