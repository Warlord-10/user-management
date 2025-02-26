import Member from "@/models/Member";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

// Return all the members of a tenant
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const tenantId = (await params)?.tenantId;

        const members = await Member.find({ tenant: tenantId }, "role user").populate("user", "name email _id")
        return NextResponse.json(members, { status: 200 })
    } catch (error) {

    }
}

// Add a user to a tenant
export async function POST(req, { params }) {
    try {
        await dbConnect();

        const tenantId = (await params)?.tenantId;
        const data = await req.json();

        const member = Member.create({
            user: data.user,
            tenant: tenantId,
            role: data.role
        });

        return NextResponse.json(member, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}