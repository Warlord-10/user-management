import React from 'react'
import { getServerSession } from 'next-auth'
import LogoutButton from './LogoutButton'
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { LucideLogIn } from 'lucide-react';

async function Navbar() {
    const session = await getServerSession(authOptions)

    const permission = () => {
        if (session?.isSuperUser) return "SuperUser"
        if (session?.isAdmin) return "Admin"
        return null
    }

    const initials = (name) => {
        const names = name.split(' ').slice(0, 2);
        return names.map(name => name[0]).join('');
    }

    return (
        <div className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center gap-6'>
                        {session && (
                            <div className='flex items-center gap-4'>
                                <div className='flex text-xl font-bold rounded-full bg-blue-100 text-blue-600 h-10 w-10 items-center justify-center'>
                                    {initials(session?.user.name)}
                                </div>
                                {permission() && (
                                    <div className='text-sm font-semibold text-gray-900'>
                                        {permission()} Console
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {(session?.isAdmin || session?.isSuperUser) && (
                            <Link
                                href="/dashboard"
                                className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                Dashboard
                            </Link>
                        )}
                        {session?.isSuperUser && (
                            <Link
                                href="/dashboard/admins"
                                className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                Admins
                            </Link>
                        )}
                        <Link
                            href="/home"
                            className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            Home
                        </Link>
                        <Link
                            href="/profile"
                            className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            Profile
                        </Link>
                        {session ? (
                            <div className='ml-2 pl-2 border-l border-gray-200'>
                                <LogoutButton />
                            </div>
                        ) : (
                            <div className='ml-2 pl-2 border-l border-gray-200'>
                                <Link href="/login" className='px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2'><LucideLogIn size={24} />Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar