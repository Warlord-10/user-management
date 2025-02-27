import React, { useState } from 'react'
import Link from 'next/link'
import { DoorOpen } from 'lucide-react'


function TenantCard({ tenant, permission = "member", leaveTenant, editTenant }) {
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState(tenant.name)


    // You can only edit if you are either a manager or an admin
    const handleEdit = async () => {
        if (permission == "member") {
            toast.error("Only managers and owners can edit tenants");
            return;
        }
        await editTenant(tenant._id, { name: newName })
        setIsEditing(false)
    }

    // You can only leave if you are a manager or a member
    const handleLeave = async () => {
        if (permission == "owner") {
            toast.error("Owner can't leave their own tenat")
            return
        }

        await leaveTenant(tenant._id)
    }
    if (isEditing) {
        return (
            <div className='flex justify-between items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm'>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => { setNewName(e.target.value) }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className='flex gap-2'>
                    <button
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        onClick={handleEdit}
                    >
                        Save
                    </button>
                    <button
                        className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
    return (
        <Link href={`/home/${tenant._id}`} className='group flex justify-between items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all'>
            <h1 className='text-lg font-medium text-gray-800'>{tenant.name}</h1>
            <div className="flex gap-2">
                {permission != "member" && (
                    <button
                        className='px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true)
                        }}
                    >
                        Edit
                    </button>
                )}
                {permission != 'owner' && (
                    <button
                        className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                        onClick={(e) => {
                            e.preventDefault();
                            handleLeave()
                        }}
                    >
                        <DoorOpen size={20} />
                    </button>
                )}
            </div>
        </Link>
    )
}

export default TenantCard