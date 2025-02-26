"use client"
import React, { useEffect, useState } from 'react'
import NewTenantForm from '@/components/NewTenantForm'
import { getSession } from 'next-auth/react'
import { toast } from 'sonner'
import TenantCard from './TenantCard'


function TenantView() {
    const [tenants, setTenants] = useState([])

    const leaveTenant = async (tenantId) => {
        try {
            const session = await getSession()
            const userId = session?.user._id;
            
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${tenantId}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            if (res.ok) {
                setTenants(tenants.filter(tenant => tenant.tenant._id !== tenantId))
                toast.success("Tenant left successfully")
            }
            else{
                throw new Error("Error leaving tenant")
            }

        } catch (error) {
            toast.error(error?.message ?? "Error leaving tenant")
        }
    }

    const editTenant = async (tenantId, data) => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/tenant/' + tenantId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setTenants(tenants.map(tenant => tenant._id === tenantId ? { ...tenant, ...data } : tenant))
                toast.success("Tenant edited successfully")
            }
            else {
                throw new Error("Error editing tenant")
            }

        } catch (error) {
            toast.error(error?.message ?? "Error editing tenant")
        }
    }


    // Fetching all the tenants the user is a part of when the page is loaded
    // It will return the tenant and the role the user has in that tenant
    useEffect(() => {
        const fetchTenants = async () => {
            console.log("fetching tenants")
            const session = await getSession()

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/user/${session?.user._id}/tenants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const data = await res.json()
            console.log("heheh",data)
            setTenants(data)
        }
        fetchTenants()
    }, [])



    return (
        <div className='flex flex-col border-2 border-black rounded-md w-full h-full p-4'>
            <div className='flex justify-between items-center gap-8 mb-2'>
                <h1 className='font-bold'>Your Tenants</h1>
            </div>

            <div className='grow overflow-y-auto'>
                <div className='flex flex-col justify-center gap-2'>
                    {tenants.map(tenant => {
                        return <TenantCard
                            key={tenant._id}
                            tenant={tenant.tenant}
                            permission={tenant.role}

                            leaveTenant={leaveTenant}
                            editTenant={editTenant}
                        />
                    })}
                </div>
            </div>
        </div>
    )
}

export default TenantView