
import NewTenantForm from "@/components/NewTenantForm"
import Link from "next/link"


async function Page() {
    const tenants = await getAllTenants()

    // Returns all the tenants from the database
    async function getAllTenants() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/tenant", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                next: { revalidate: 10 }
            })

            const data = await response.json()
            return data
        } catch (error) {
            console.error("failed to fetch all the tenants")
        }
    }

    
    // Creates a new tenant
    const addNewTenant = async (data) => {
        "use server"
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/tenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const tenant = await response.json();
                // setTenants([...tenants, tenant])
                return tenant
            }
        } catch (error) {
            return error
        }
    }



    return (
        <div className="h-full flex flex-col p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Tenants</h1>
                <NewTenantForm addNewTenant={addNewTenant} />
            </div>

            <div className="flex-1 min-h-0 bg-gray-50 rounded-lg border border-gray-200 flex flex-col">
                <div className="grid grid-cols-2 w-full font-semibold p-4 border-b border-gray-200">
                    <h2 className="text-gray-600">Tenant Name</h2>
                    <h2 className="text-gray-600 text-right">Owner Name</h2>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                    {tenants.map((tenant) => (
                        <Link
                            key={tenant._id}
                            href={`/dashboard/${tenant._id}`}
                            className="grid grid-cols-2 w-full p-4 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium text-gray-800">{tenant.name}</span>
                            <span className="text-gray-600 text-right">{tenant.owner.name}</span>
                        </Link>
                    ))}

                    {tenants.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <p className="text-lg">No tenants found</p>
                            <p className="text-sm">Create a new tenant to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page