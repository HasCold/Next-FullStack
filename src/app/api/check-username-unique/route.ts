import connectDB from "@/config/db";
import UserModel from "@/models/user.Model";
import { userNameValidation } from "@/schemas/signup.Schema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: userNameValidation
});

export async function GET(req: Request){ 
    await connectDB();
    // localhost:3000/api/cuu?username=hitesh?phone=android
    try {
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate with zod
        const res = UsernameQuerySchema.safeParse(queryParam);
        if(!res.success){
            const usernameErrors = res.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
            }, {status: 400})
        }

        const {username} = res.data;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        }, {status: 200})

    } catch (err) {
        console.error("Error checking username :- ", err)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500});
    }
}