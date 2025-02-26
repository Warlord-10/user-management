"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { useSession } from 'next-auth/react';


function TenantEditDashboard({ tenantData }) {
    const session = useSession();
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState(tenantData.name);


    // To edit a tenant details
    async function editTenant() {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${tenantData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: newName }),
            })
            if (res.ok) {
                toast.success("Tenant edited")
                setIsEditing(false);
            } else {
                toast.error("Failed to edit")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    // To delete a tenant 
    async function deleteTenant() {
        try {
            if (
                (tenantData.owner != session?.data.user._id)
                || (!session?.data.isAdmin)
                || (!session?.data.isOwner)
            ) {
                throw new Error("Only owner can delete the tenant")
            }

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${tenantData._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (res.ok) {
                toast.success("Tenant deleted successfully")
            } else {
                throw new Error("Tenant deletion failed")
            }
        } catch (error) {
            toast.error(error?.message)
        }
    }

    if (isEditing) {
        return (
            <div className="flex justify-between p-2 items-center rounded-lg bg-white border border-gray-200 shadow-sm">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className='flex gap-2'>
                    <button
                        onClick={editTenant}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">{tenantData.name}</h1>
            <div className="flex gap-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    Edit
                </button>
                <AlertDialog>
                    <AlertDialogTrigger className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the tenant
                                and remove all data associated with it.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={deleteTenant}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default TenantEditDashboard