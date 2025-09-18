import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbConnection } from "./database/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();

config({
    path: "./config/config.env"
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./temp",
    })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

dbConnection();

export default app;

