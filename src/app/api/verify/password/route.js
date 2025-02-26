import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { sendEmail } from "@/networking/mailer";
import { hash } from "bcrypt";


// Sends email for password reset
export async function GET(req){
    try {
        const searchParams = req.nextUrl.searchParams
        console.log(searchParams.get("email"), searchParams.get("id"))

        const res = await sendEmail({
            email: searchParams.get("email"),
            emailType: "RESET",
            userId: searchParams.get("id")
        })

        return NextResponse.json({
            message: "Email sent successfully",
            ok: true
        }, {status: 200})

    } catch (error) {
        return NextResponse.error(error)
    }
}

// reset password
export async function POST(req){
    try {
        await dbConnect();
        const {token, newPassword} = await req.json();

        if(newPassword == null) return NextResponse.error("New password is required")
        
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {$gt: Date.now()}
        })

        if(!user){
            return NextResponse.error("Invalid token")
        }

        const hashedPassword = await hash(newPassword, 10);
        
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Password changed successfully"
        }, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.error(error)
    }
}