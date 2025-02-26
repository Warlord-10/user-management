import ProfileEdit from '@/components/ProfileEdit'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

async function Page() {
    const session = await getServerSession(authOptions) || null
    if(!session){
        return redirect('/login')
    }
    
    return <ProfileEdit user={session.user}/>
}

export default Page