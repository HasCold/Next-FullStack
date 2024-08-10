// Standardized the TypeScript Response

import { Message } from "@/models/user.Model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}