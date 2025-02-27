"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import UserCard from '@/components/UserCard'

function AdminPage() {
    const session = useSession()?.data
    const [users, setUsers] = useState([])

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/user/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })
                const data = await res.json()
                setUsers(data)
            } catch (error) {
                toast.error('Failed to fetch users')
            }
        }

        fetchUsers()
    }, [])

    // Handle role change
    const handleRoleChange = async (userId, isAdmin) => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isAdmin: isAdmin })
            })

            if (res.ok) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isAdmin } : user
                ))
                toast.success('User role updated successfully')
            } else {
                throw new Error('Failed to update user role')
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update user role')
        }
    }

    if (!session?.isSuperUser) {
        return (
            <div className="p-4 text-center text-red-500">
                Access denied. Only SuperUser can view this page.
            </div>
        )
    }

    return (
        <div className='h-full flex flex-col p-6 bg-white rounded-lg border border-gray-200 shadow-sm'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>Admin Management</h1>
            <div className='flex-1 overflow-y-auto'>
                <div className='space-y-4'>
                    {users.map(user => {
                        if(user._id === session.user._id) return null;

                        return <div key={user._id} className='flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50'>
                            <div>
                                <h2 className='font-medium text-gray-800'>{user.name}</h2>
                                <p className='text-sm text-gray-500'>{user.email}</p>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='checkbox'
                                        checked={user.isAdmin}
                                        onChange={(e) => handleRoleChange(user._id, e.target.checked)}
                                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                                        disabled={user._id === session.user._id}
                                    />
                                    <span className='text-sm text-gray-600'>Admin</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default AdminPage