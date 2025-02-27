import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await dbConnect();
        const {token} = await req.json();
        
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: Date.now()}
        })

        if(!user){
            return NextResponse.error("Invalid token")
        }

        user.emailVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully"
        }, {status: 200})

    } catch (error) {
        return NextResponse.error(error)
    }
}