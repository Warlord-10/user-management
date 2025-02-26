import React from 'react'

async function Page() {
    async function getAllTenants() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/tenant", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                next: { revalidate: 10 }
            })
    
            const data = await response.json()
            return data
        } catch (error) {
            console.error("failed to fetch tenant count")
        }
    }

    async function getUserCount() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                next: { revalidate: 10 }
            })
    
            const data = await response.json()
            return data
        } catch (error) {
            console.error("failed to fetch user count")
        }
    }

    const userCount = await getUserCount()
    const tenants = await getAllTenants()


    return (
        <div className='flex justify-evenly w-full border-gray-300 border-2 rounded-md p-2'>
            <div className='flex flex-col items-center border-black border-2 rounded-md p-2'>
                <h1 className='font-bold text-lg'>Users</h1>
                <h1 className='font-extrabold text-4xl'>{userCount}</h1>
            </div>
            <div className='flex flex-col items-center border-black border-2 rounded-md p-2'>
                <h1 className='font-bold text-lg'>Tenants</h1>
                <h1 className='font-extrabold text-4xl'>{tenants.length}</h1>
            </div>
        </div>
    )
}

export default Page