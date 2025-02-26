import Tenant from "@/models/Tenant";
import Member from "@/models/Member";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

// Returns a specific tenant
export async function GET(req, {params}) {
    try {
        await dbConnect();
        const tenant = await Tenant.findOne({_id: (await params)?.tenantId})
        return NextResponse.json(tenant, {status: 200})
    } catch (error) {
        return NextResponse.error("Error occurred", {status: 500})
    }
}

// Update a tenant
export async function PUT(req, {params}){
    try {
        await dbConnect();
        const data = await req.json()

        const tenant = await Tenant.updateOne({_id: (await params)?.tenantId}, data)
        return NextResponse.json("Tenant updated", {status: 200})
    } catch (error) {
        return NextResponse.error("Error occurred", {status: 500})
    }
}

// Delete a tenant
export async function DELETE(req, {params}){
    try {
        await dbConnect();

        const tenant = await Tenant.deleteOne({_id: (await params)?.tenantId})
        // Delete all members in the tenant
        const members = await Member.deleteMany({tenant: (await params)?.tenantId})

        return NextResponse.json("Tenant deleted", {status: 200})
    } catch (error) {
        return NextResponse.error("Error occurred", {status: 500})
    }
}