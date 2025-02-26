import Member from "@/models/Member";
import Tenant from "@/models/Tenant";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

// Return all the Tenants
export async function GET(req){
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get('name')

        // If query params are given then return the tenants
        // Else return all tenants 
        if(query){
            const allTenants = await Tenant.find({name: {$regex: query, $options: 'i'}}).populate("owner", "name")
            return NextResponse.json(allTenants)
        }
        else{
            const allTenants = await Tenant.find().populate("owner", "name")
            return NextResponse.json(allTenants)
        }

    } catch (error) {
        return NextResponse.error(error)
    }
}

// Create a new Tenant
export async function POST(req){
    try {
        await dbConnect();
        const data = await req.json()

        // creating the tenant
        const tenant = await Tenant.create(data)

        // the creator will be the admin of the tenant
        const member = await Member.create({
            user: data.owner,
            tenant: tenant._id,
            role: "owner"
        })
        member.tenant = tenant

        return NextResponse.json(member)
    } catch (error) {
        return NextResponse.error(error)
    }
}
