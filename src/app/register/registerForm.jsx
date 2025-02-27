"use client";
import React, { useState } from 'react';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react'
import Link from 'next/link';
import { loginWithGithub, loginWithGoogle } from '@/lib/actions/authActions';


function RegisterForm() {
    const [signupResponse, setSignupResponse] = useState(null);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
    
            if(response.ok){
                setSignupResponse(<div className='text-green-500'>Verification email sent</div>)
            } else{
                throw new Error('Registration failed');
            }
        } catch (error) {
            setSignupResponse(<div className='text-red-500'>Registration failed</div>)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <UserIcon size={16} />
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name='name'
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-black"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <MailIcon size={16} />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name='email'
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-black"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LockIcon size={16} />
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name='password'
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-black"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            {signupResponse}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        > Sign Up
                        </button>
                    </form>

                    <div className="text-center text-gray-600">
                        <p>Already have an account? 
                            <Link href="/login" className="text-purple-500 hover:text-purple-600 font-semibold"> Sign In</Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center border border-gray-500 rounded-lg p-3 hover:bg-gray-300 transition-colors" onClick={loginWithGoogle}>
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                                </svg>
                            </button>

                            <button className="flex items-center justify-center border border-gray-500 rounded-lg p-3 hover:bg-gray-300 transition-colors" onClick={loginWithGithub}>
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.55 3.297-1.55.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm