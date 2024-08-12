import connectDB from "@/config/db";
import UserModel from "@/models/user.Model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await connectDB();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {username: credentials.identifier},
                            {email: credentials.identifier},
                        ]
                    });

                    if(!user) throw new Error("No user found with these email");
                    if(!user.isVerified) throw new Error("Please verify your account before login");

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect Password");
                    }

                } catch (err: any) {
                    throw new Error(err)
                }

            }
        })
    ], 
    pages: {
        signIn: "/sign-in"  // we have given the control of sign-in route to the Next-Auth, so next-auth will handle all the thing for us 
    },
    callbacks: {
        async jwt({ token, user }) {
            // we are creating the token more powerful so in this case we can collect out the user info and store it into token 
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },
        async session({ session, token}) {
                if(token){
                    session.user._id = token._id?.toString();
                    session.user.isVerified = token?.isVerified;
                    session.user.isAcceptingMessages = token?.isAcceptingMessages;
                    session.user.username = token?.username;
                }

            return session
        }
    },
    session: {
        strategy: "jwt"
    }, 
    secret: process.env.NEXTAUTH_SECRET
} 