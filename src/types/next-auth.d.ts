// we are re-declaring the type of our module as per our custom authentication in the Next-Auth

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User{
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }

    interface Session{
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;            
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}

// Refer how to write our own custom adapters
// https://next-auth.js.org/getting-started/typescript#adapters