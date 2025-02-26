"use client"
import { getSession, useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"


function NewTenantForm({addNewTenant}) {
    const session = useSession();
    const permission = session.data?.isAdmin || session.data?.isSuperUser

    const closeRef = useRef(null)

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            // Data validation
            if(!permission) throw new Error('Only admins can create tenants')

            const session = await getSession()
            const formData = new FormData(e.target)
            const name = formData.get('name')

            if (!name) throw new Error('Name is required')

            // Actual function call
            const ans = await addNewTenant({
                name: name,
                owner: session.user._id
            })
            toast.success("Tenant created successfully")
            closeRef.current.click()
        } catch (error) {
            toast.error(error?.message)
        }
    }

    if(!permission) return null;

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Plus size={20} />
                    <span>New Tenant</span>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Create New Tenant</DialogTitle>
                </DialogHeader>
                <form className='mt-4 space-y-6' onSubmit={handleSubmit}>
                    <div className='space-y-2'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Tenant Name</label>
                        <input 
                            type='text' 
                            id='name' 
                            name='name' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder="Enter tenant name"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <DialogClose className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </DialogClose>
                        <button 
                            type='submit' 
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                            Create Tenant
                        </button>
                    </div>
                </form>
            </DialogContent>
            <DialogClose ref={closeRef} className="hidden" />
        </Dialog>
    )
}

export default NewTenantForm