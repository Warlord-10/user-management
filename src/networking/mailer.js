import nodemailer from "nodemailer"
import User from "@/models/User"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"
import dbConnect from "@/utils/mongodb";


export async function sendEmail({ email, emailType, userId }) {
    try {
        await dbConnect();
        const hashedToken = await hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            const user = await User.findOneAndUpdate({email: email}, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })

            if(!user) return NextResponse.error("User not found")
        }
        else if (emailType === "RESET") {
            const user = await User.findOneAndUpdate({email: email}, {
                resetToken: hashedToken,
                resetTokenExpiry: Date.now() + 3600000
            })
            if(!user) return NextResponse.error("User not found")
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "cf24bbd5f2154a",
                pass: "6ee344aea30333"
            }
        });

        const mailOptions = {
            from: "user-management@no-reply.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: 
                emailType === "VERIFY" 
                    ? `<p>Click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify/email?token=${hashedToken}">here</a> to verify your email` 
                    : `<p>Click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify/password?token=${hashedToken}">here</a> to change your password`
        }

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;

    } catch (error) {
        throw new Error(error.message)
    }

}


