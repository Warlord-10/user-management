import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/options"

// Restricted route, only superuser, ie with role="admin" can access it
async function Layout({ children, tenant, user }) {
  const session = await getServerSession(authOptions) ?? null

  if(!session?.isSuperUser && !session?.isAdmin){
    return redirect('/home')
  }

  return (
    <div className='flex p-2 gap-2 h-[calc(100vh-4rem)] overflow-hidden justify-center w-full px-10'>

      <div className='flex flex-col h-full gap-2 w-full'>
        {children}
        <div className='h-[80%]'>
          {tenant}
        </div>
      </div>

      <div className='flex flex-col h-full w-full'>
        {user}
      </div>

    </div>
  )
}

export default Layout