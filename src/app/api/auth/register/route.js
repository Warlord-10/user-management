import { NextResponse } from "next/server";
import {hash} from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { sendEmail } from "@/networking/mailer";

// For registering a new user
export async function POST(req){
    try {
        await dbConnect();
        const {email, password, name} = await req.json();
        const hashedPassword = await hash(password, 10);

        const user = await User.create({
            email: email,
            password: hashedPassword,
            name: name
        })

        // Sending verification email
        await sendEmail({email, emailType: "VERIFY", userId: user._id})

        return NextResponse.json({message: "success"}, {status: 201})
        
    } catch (error) {
        return NextResponse.error(error, {status: 500})
    }
}