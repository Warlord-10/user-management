import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import TenantEditDashboard from "@/components/TenantEditDashboard";
import UserView from "@/components/UserView"
import { getServerSession } from "next-auth";


async function Page({ params }) {
    const { tenantId } = await params;
    const tenantData = await fetchTenant(tenantId);

    // Fetch tenant details
    async function fetchTenant(tenantId) {
        try {
            const respone = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tenant/${tenantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: {revalidate: 10},
            })
            
            const tenantData = await respone.json();
            return tenantData;
        } catch (error) {
            console.error("failed to fetch tenant details")
        }
    }

    return (
        <div className="h-full flex flex-col gap-2">
            <TenantEditDashboard tenantData={tenantData} />
            <UserView />
        </div>
    )
}

export default Page