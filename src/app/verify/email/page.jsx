"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle } from 'lucide-react';

function Page() {
    const router = useRouter();
    const session = useSession();
    const searchParams = useSearchParams();
    const search = searchParams.get("token");
    
    const [verifyResponse, setVerifyResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.push("/login");
        }
    }, []);

    if (search === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div className="text-red-500 font-medium">Invalid Verification Token</div>
                </div>
            </div>
        );
    }

    async function verifyEmail() {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: search.toString() }),
            });

            if (response.ok) {
                setVerifyResponse(<div className="text-green-500 font-medium flex items-center gap-2">
                    <CheckCircle size={20} />
                    Email verified successfully
                </div>);

                setTimeout(() => {
                    setVerifyResponse(null);
                    router.push("/login");
                }, 1500);
            } else {
                throw new Error("Verification failed");
            }
        } catch (error) {
            setVerifyResponse(<div className="text-red-500 font-medium">Something went wrong</div>);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Click the button below to verify your email address
                    </p>
                </div>
                <div className="space-y-4">
                    <button 
                        onClick={verifyEmail} 
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                    <div className="flex justify-center">{verifyResponse}</div>
                </div>
            </div>
        </div>
    );
}

export default Page;
