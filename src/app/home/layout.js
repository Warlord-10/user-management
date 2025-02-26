import React from 'react'
import SearchTenant from '@/components/SearchTenant'
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/options"

async function Layout({ children, tenant, user }) {
  const session = await getServerSession(authOptions) ?? null

  if(!session){
    return redirect('/login')
  }


  return (
    <div className='flex p-2 gap-2 h-[calc(100vh-4rem)] overflow-hidden justify-center w-full px-10'>
      
      <div className='flex flex-col h-full gap-2 w-full'>
        <div className='h-1/2'>
          {tenant}
        </div>
        <div className='h-1/2'>
          <SearchTenant />
        </div>
      </div>

      <div className='flex flex-col h-full w-full'>
        {user}
      </div>
      
    </div>
  )
}

export default Layout