import TenantView from '@/components/TenantView'
import { redirect } from 'next/navigation'

function Default() {
  // return <TenantView />
  redirect(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard")
}

export default Default