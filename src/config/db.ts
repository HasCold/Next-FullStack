// Next JS is basically an edge time framework
// All functions written in Next.js will also run at ontime

import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number
}

const connection: ConnectObject = {}

async function connectDB(): Promise<void>{ // Don't care what type of data is returning
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGO_URI as string)        
        connection.isConnected = db.connections[0].readyState

        console.log(`MongoDB Atlas successfully connected : ${db.connection.host}`)

    } catch (error: any) {
        console.error("Database connection failed :- ",error.message)
        process.exit(1); // Gracefully exit the DB connection

    }
}

export default connectDB