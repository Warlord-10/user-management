"use server"
const { authOptions } = require("@/app/api/auth/[...nextauth]/options")
const { getServerSession } = require("next-auth")

const hasGlobalAccess = async() => {
    const session = await getServerSession(authOptions)
    
    if(!session) return false;
    if(session.isAdmin || session.isSuperUser) return true;
    return false;
} 

export { hasGlobalAccess }