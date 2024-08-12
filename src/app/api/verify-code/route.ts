import connectDB from "@/config/db";
import UserModel from "@/models/user.Model";
import { verifySchema } from "@/schemas/verify.Schema";
import { z } from "zod";

const VerifyCodeSchema = z.object({
    verifyCode: verifySchema
});

export async function GET(req: Request){
    await connectDB()

    try {
        const {username, code} = await req.json()
        const decodedUsername = decodeURIComponent(username); // Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI)

        const res = VerifyCodeSchema.safeParse(code);
        if(!res.success){
            const verifyCodeError = res.error.format().verifyCode?._errors || [];
            return Response.json({
                success: false,
                message: verifyCodeError.length > 0 ? verifyCodeError.join(', ') : "Invalid query parameters"
            }, {status: 400})
        }

        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200});

        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Please signup again"
            }, {status: 400});

        }else {
            return Response.json({
                success: false,
                message: "Incorrect verification code."
            }, {status: 500});
            
        }

    } catch (err) {
        console.error("Error in verification of code", err);
        return Response.json({
            success: false,
            message: "Error in verification of code"
        }, {status: 500})
    }
}