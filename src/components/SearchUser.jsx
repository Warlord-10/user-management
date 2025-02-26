"use client"
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

function SearchUser() {
    const session = useSession()?.data;
    const params = useParams();

    const [usersResult, setUsersResult] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [permission, setPermission] = useState("member");



    async function fetchUsers(name) {
        try {
            if (name.trim() === "") throw new Error("No name is provided");

            const results = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/user/?name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (results.ok) {
                const data = await results.json();
                setUsersResult(data);
                return;
            }
            else {
                throw new Error("Error occurred in searching for users")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    async function addToTenant(userId) {
        try {
            if (!params.tenantId) {
                throw new Error("No tenant selected")
            }
            if (permission == "member") throw new Error("Only managers and Onwers can add other users")

            const results = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${params.tenantId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ user: userId, role: "member" })
            });

            if (results.ok) {
                toast.success("Added to tenant");
            }
            else {
                throw new Error("Error in adding to tenant")
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // On page load it will load the role of the user over the current tenant 
    useEffect(() => {
        async function fetchRelationship() {
            try {
                if (!params.tenantId) return;

                const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${params.tenantId}/members/${session?.user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setPermission(data.role);
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchRelationship();
    }, [params?.tenantId])

    return (
        <div className='h-full flex flex-col rounded-lg p-6 bg-white shadow-sm border border-gray-200'>
            <h1 className='font-bold text-xl mb-4 text-gray-800'>Find Users</h1>
            <div className='flex w-full mb-4'>
                <input
                    className='border border-gray-300 rounded-l-lg flex grow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    type="text"
                    placeholder="Search by name"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                    className='bg-blue-500 text-white rounded-r-lg px-6 py-2 hover:bg-blue-600 transition-colors'
                    onClick={() => fetchUsers(searchValue)}
                > Search </button>
            </div>

            <div className='grow flex flex-col w-full overflow-y-auto rounded-lg border border-gray-200'>
                {usersResult.map((user) => (
                    <div key={user._id} className='flex items-center w-full p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                        <h3 className='text-gray-800'>{user.name}</h3>
                        {(permission == "manager" || permission == "owner") && (
                            <button 
                                className='ml-auto w-9 h-9 hover:bg-blue-100 rounded-full flex items-center justify-center text-blue-500 transition-colors'
                                onClick={() => addToTenant(user._id)}
                            >
                                <PlusIcon size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchUser