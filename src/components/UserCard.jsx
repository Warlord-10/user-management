import React, { useState } from 'react'
import { Crown, DoorOpen } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { hasGlobalAccess } from '@/lib/getGlobalRole';


function UserCard({ member, permission, role, kickUser, changeRole }) {
  async function handleChangeRole(newRole) {
    // SuperUser has all the permissions
    if (await hasGlobalAccess()) {
      changeRole(member._id, { role: newRole });
    }

    if (permission != "owner") {
      toast.error("Roles can only be changed by the owner.");
      return;
    }
    changeRole(member._id, { role: newRole });
  }

  async function handleKick() {
    // SuperUser has all the permissions
    if (await hasGlobalAccess()) {
      kickUser(member._id);
    }

    if (permission == "member") {
      toast.error("Members cannot kick other users");
      return;
    }
    if (permission == "manager" && role == "manager") {
      toast.error("You cannot kick another manager");
      return;
    }
    kickUser(member._id);
  }

  return (
    <div className='flex justify-between items-center rounded-lg bg-white p-4 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm'>
      <h1 className='text-gray-800 font-medium'>{member.name}</h1>

      <div className='flex items-center gap-4'>
        {(role != "owner" && permission == "owner") && (
          <Select onValueChange={handleChangeRole} defaultValue={role}>
            <SelectTrigger className="w-[180px] border border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        )}

        {(permission != "member" && role != "owner" && permission != role) && (
          <button
            className='p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors'
            onClick={handleKick}
          >
            <DoorOpen size={20} />
          </button>
        )}
        <span className='px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full'>
          Role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      </div>

    </div>
  )
}

export default UserCard