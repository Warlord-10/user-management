import User from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";


// Return all the Users Count
export async function GET(req){
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get('name')

        // If query params are given then return the users
        // Else return the users count
        if(query){
            const allTenants = await User.find({name: {$regex: query, $options: 'i'}})
            return NextResponse.json(allTenants)
        }
        else{
            const allTenants = await User.find()
            return NextResponse.json(allTenants.length)
        }
    } catch (error) {
        console.log(error)
        return NextResponse.error(error)
    }
}
