"use client"
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react';
import { toast } from "sonner"


function SearchTenant() {
    const session = useSession();
    const params = useParams();

    const role = session.data?.user?.role || "member"
    const userId = session.data?.user?._id;

    const [tenantsResult, setTenantsResult] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    async function fetchTenants(name) {
        if (name.trim() === "") return;
        const results = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/?name=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await results.json();
        setTenantsResult(data);
    }

    async function joinTenant(tenantId) {
        try {
            if (!userId) {
                return;
            }

            const results = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${tenantId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ user: userId, role: "member" })
            });

            if (results.ok) {
                toast.success("Tenant joined successfully")
            } else {
                throw new Error("Failed to join tenant")
            }
        } catch (error) {
            toast.error(error?.message)
        }
    }


    return (
        <div className='h-full flex flex-col border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
            <h1 className='font-bold text-xl mb-2 text-gray-800'>Find New Tenants</h1>
            <div className='flex w-full mb-4'>
                <input
                    className='border border-gray-300 rounded-l-lg flex grow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    type="text"
                    placeholder="Search by name"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                    className='bg-blue-500 text-white rounded-r-lg px-6 py-2 hover:bg-blue-600 transition-colors'
                    onClick={() => fetchTenants(searchValue)}
                > Search </button>
            </div>
            
            <div className='grow overflow-y-auto rounded-lg border border-gray-200'>
                <div className='grid grid-cols-3 w-full p-3 font-semibold bg-gray-50 border-b border-gray-200'>
                    <div className='text-left pl-4 text-gray-600'>Tenant Name</div>
                    <div className='text-center text-gray-600'>Owner</div>
                    <div className='text-right pr-4 text-gray-600'>Action</div>
                </div>
                <div className='divide-y divide-gray-200'>
                    {tenantsResult.map((tenant) => (
                        <div key={tenant._id} className='grid grid-cols-3 w-full p-1 hover:bg-gray-50 transition-colors items-center'>
                            <div className='truncate text-left pl-4 text-gray-800'>{tenant.name}</div>
                            <div className='truncate text-center text-gray-600'>{tenant.owner.name}</div>
                            <div className='flex justify-end pr-4'>
                                <button 
                                    className='w-9 h-9 hover:bg-blue-100 rounded-full flex items-center justify-center text-blue-500 transition-colors'
                                    onClick={() => joinTenant(tenant._id)}
                                >
                                    <PlusIcon size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchTenant