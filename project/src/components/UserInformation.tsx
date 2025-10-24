'use server'

import { auth } from "@/auth"

export const getUserInformation = async () => {
    const session = await auth();
    console.log('i m here')
    if (session?.user) {
       return session
    }
    return 'nothiun'
}