import { getServerSession } from 'next-auth';
import RegisterForm from './registerForm';
import { redirect } from 'next/navigation';

async function Page() {
    const session = await getServerSession() || null
    
    if(!session) return <RegisterForm />
    else redirect('/dashboard')
}

export default Page
