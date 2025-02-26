"use client"
import React, { useEffect, useState } from 'react';
import { User, Mail, Key, Edit2, Check, X } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
// import { sendEmail } from '@/networking/mailer';

function ProfileEdit({ user }) {
    const [session, setSession] = useState(user);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(user);
    const [editForm, setEditForm] = useState(userData);
    const [editRes, setEditRes] = useState(null);

    const initials = (name) => {
        const names = name.split(' ').slice(0, 2);
        return names.map(name => name[0]).join('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would make an API call here
        setUserData(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(userData);
        setIsEditing(false);
    };

    const handleResetPassword = async (e) => {
        try {
            e.preventDefault();

            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/verify/password?email=${session.email}&id=${session._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (response.ok) {
                setEditRes(<div className='text-green-500'>Password reset email sent</div>)
            } else {
                throw new Error('Something went wrong')
            }
        } catch (error) {
            setEditRes(<div className='text-red-500'>{error.message}</div>)
        }
    }

    useEffect(() => {
        async function fetchSesstion() {
            setSession(await getSession().then(session => session?.user))
        }
        fetchSesstion()

        return () => { }
    }, [userData]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    {/* Profile Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/home" className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                            <ChevronLeft size={20} className="text-gray-600" />
                        </Link>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className='flex text-2xl font-bold rounded-full bg-blue-100 text-blue-600 h-24 w-24 items-center justify-center border-2 border-blue-200'>
                                {initials(session.name)}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-4 w-full">
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                                <User className="w-5 h-5 text-gray-500" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="flex-1 bg-white border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="text-lg text-gray-800">{session.name}</span>
                                )}
                            </div>

                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                                <Mail className="w-5 h-5 text-gray-500" />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="flex-1 bg-white border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="text-gray-600">{session.email}</span>
                                )}
                            </div>

                            {/* Change Password Link */}
                            {isEditing && (
                                <div className="pt-4 flex flex-col items-center">
                                    <button 
                                        className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700'
                                        onClick={handleResetPassword}
                                    >
                                        Change Password
                                    </button>
                                    <div className='mt-2'>{editRes}</div>
                                </div>
                            )}

                            {/* Edit Mode Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;