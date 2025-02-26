import React from 'react'
import LoginForm from './loginForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

async function Page() {
    const session = await getServerSession() || null
    
    if(!session) return <LoginForm />
    else redirect('/home')
}

export default Page