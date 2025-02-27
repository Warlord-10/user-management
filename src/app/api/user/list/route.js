import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";


// Return all the Users Count
export async function GET(req) {
    try {
        await dbConnect();

        const allTenants = await User.find()
        return NextResponse.json(allTenants)
    } catch (error) {
        return NextResponse.error(error)
    }
}
