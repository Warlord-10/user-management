"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { KeyRound } from 'lucide-react';

function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("token");
    
    const [verifyResponse, setVerifyResponse] = useState(null);
    const [pass, setPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (search === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div className="text-red-500 font-medium">Invalid Reset Token</div>
                </div>
            </div>
        );
    }

    async function verifyPassword() {
        try {
            setIsLoading(true);
            if(pass === "") {
                throw new Error("Password cannot be empty");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: search.toString(), newPassword: pass }),
            });
    
            if (response.ok) {
                setVerifyResponse(<div className="text-green-500 font-medium">Password changed successfully</div>);
                setTimeout(() => {
                    setVerifyResponse(null);
                    router.push("/login");
                }, 1500);
            }
            else if(response.error) {
                throw new Error(response.error);
            }
        } catch (error) {
            setVerifyResponse(<div className="text-red-500 font-medium">{error.message}</div>);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input 
                            id="password"
                            type="password"
                            name="password" 
                            onChange={e => setPass(e.target.value)} 
                            value={pass} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button 
                        onClick={verifyPassword} 
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <KeyRound size={20} />
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    <div className="flex justify-center">{verifyResponse}</div>
                </div>
            </div>
        </div>
    );
}

export default Page;
