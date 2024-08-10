// Data base connection will apply on every route because database connection will run on the edge time

import connectDB from "@/config/db"


export async function POST(req: Request){
    await connectDB();
    try {
        const {email, username, password} = await req.json();


    } catch (error: any) {
        console.error("Error registering user", error.message)
        return Response.json(
            {success: false, message: "Error registering user"},
            {status: 500}
        )
    }
}