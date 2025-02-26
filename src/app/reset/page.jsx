"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'

function Page() {
    const router = useRouter();
    const [mail, setMail] = useState("")
    const [res, setRes] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if(!mail){
                return setRes(
                    <div className='flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg'>
                        <span className='font-medium'>Email is required</span>
                    </div>
                )
            }
            
            setIsLoading(true)
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/verify/password?email=${mail}&id=${mail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            
            if(response.ok){
                setRes(
                    <div className='flex items-center gap-2 text-green-500 bg-green-50 p-3 rounded-lg'>
                        <span className='font-medium'>Reset link sent to your email</span>
                    </div>
                )
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else{
                throw new Error('Failed to send reset link');
            }
        } catch (error) {
            setRes(
                <div className='flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg'>
                    <span className='font-medium'>{error.message}</span>
                </div>
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md'>
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive a reset link
                    </p>
                </div>
                <form onSubmit={handleResetPassword} className='space-y-6'>
                    <div className='space-y-2'>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Mail className='h-5 w-5 text-gray-400' />
                            </div>
                            <input 
                                id="email"
                                type="email" 
                                value={mail} 
                                onChange={(e) => setMail(e.target.value)} 
                                placeholder="Enter your email"
                                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className='flex justify-center'>{res}</div>
                </form>
            </div>
        </div>
    )
}

export default Page