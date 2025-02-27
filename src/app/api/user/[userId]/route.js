import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, {params}){
    try {
        await dbConnect();
        const data = await req.json()

        const user = await User.updateOne({_id: (await params)?.userId}, data)
        return NextResponse.json("User updated", {status: 200})
    } catch (error) {
        return NextResponse.error("Error occurred", {status: 500})
    }
}