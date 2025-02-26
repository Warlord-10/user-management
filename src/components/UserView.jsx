"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import UserCard from './UserCard'
import SearchUser from './SearchUser'
import { hasGlobalAccess } from '@/lib/getGlobalRole'

function UserView() {
    const params = useParams()
    const session = useSession()?.data;
    
    const [members, setMembers] = useState([])
    const [permission, setPermission] = useState("member")

    // Will kick the user out from the tenant
    const kickMember = async (userId) => {
        try {
            if (permission == "member" || !hasGlobalAccess()) throw new Error("Members can't kick users");

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${params.tenantId}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const data = await res.json()

            setMembers(members.filter(user => user.user._id != userId))
            toast.success("User kicked out from tenant")
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Will change the role of the user
    const changeRole = async (memberId, data) => {
        try {
            if (permission != "owner" || !hasGlobalAccess()) throw new Error("Only admin can change roles");

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${params.tenantId}/members/${memberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })

            if (res.ok) {
                const data = await res.json();
                toast.success("User role changed")
            }
        } catch (error) {
            toast.error("Error in promoting user")
        }
    }

    // It will fetch all the members of a tenant and 
    // will set the permission of the user for the current tenant
    useEffect(() => {
        const fetchMembers = async () => {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${params.tenantId}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 10 },
                credentials: 'include',
            })
            const data = await res.json()

            // Setting the permission of the user for the current tenant
            for (let i = 0; i < data.length; i++) {
                if (data[i].user._id == session?.user._id) {
                    setPermission(data[i].role)
                    break;
                }
            }
            setMembers(data)
            console.log(data)
        }

        fetchMembers()
    }, [])

    return (
        <div className='h-full flex flex-col gap-2'>
            <div className='h-1/2 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                <div className='p-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-semibold text-gray-800'>Team Members</h1>
                        <span className='px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full'>
                            Role: {permission.charAt(0).toUpperCase() + permission.slice(1)}
                        </span>
                    </div>
                </div>

                <div className='flex-1 p-4 overflow-y-auto'>
                    <div className='space-y-3'>
                        {members.map(relation => (
                            <UserCard
                                key={relation._id}
                                member={relation.user}
                                role={relation.role}
                                kickUser={kickMember}
                                changeRole={changeRole}
                                permission={permission}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {permission != "member" && (
                <div className='h-1/2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                    <SearchUser />
                </div>
            )}
        </div>
    )
}

export default UserView