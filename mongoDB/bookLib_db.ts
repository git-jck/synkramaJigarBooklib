import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect("mongodb://localhost:27017/bookDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = 'Bearer yesauth1234';
        if (token === authHeader) {
            next();
        } else {
            res.status(403).send("Invalid token");
        }
    } else {
        res.status(401).send("Authentication required");
    }
};

export { connectDB, authenticationMiddleware };