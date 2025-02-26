import Member from "@/models/Member";
import Tenant from "@/models/Tenant";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";


// Return all the tenants that a user is a member of
export async function GET(req, {params}){
    try {
        await dbConnect();
        const userId = (await params)?.userId

        const userAllTenants = await Member.find({user: userId}, "tenant role").populate({path: "tenant", model: Tenant})

        return NextResponse.json(userAllTenants)
    } catch (error) {
        return NextResponse.error(error)
    }
}