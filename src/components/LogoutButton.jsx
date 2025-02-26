"use client"
import { logout } from '@/lib/actions/authActions'
import React from 'react'
import { LogOut } from 'lucide-react'

function LogoutButton() {
    return (
        <button 
            className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2' 
            onClick={logout}
        >
            <LogOut size={18} />
            Logout
        </button>
    )
}

export default LogoutButton