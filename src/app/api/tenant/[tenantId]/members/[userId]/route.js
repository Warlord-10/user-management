import Member from "@/models/Member";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

// Get relationship info
export async function GET(req, {params}){
    try {
        await dbConnect();

        const response = await Member.findOne({user: (await params).userId, tenant: (await params).tenantId});
        
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.error(error)
    }
}


// Edits a member's role in a tenant
export async function PUT(req, {params}){
    try {
        await dbConnect();

        const data = await req.json();

        const response = await Member.updateOne({user: (await params).userId, tenant: (await params).tenantId}, data);

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.error(error)
    }
}

// Removes a member from a tenant
export async function DELETE(req, {params}){
    try {
        await dbConnect();

        const response = await Member.deleteOne({user: (await params).userId, tenant: (await params).tenantId})

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.error(error)
    }
}