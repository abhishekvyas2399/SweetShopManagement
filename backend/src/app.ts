import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"
import {globalErrorHandler} from "./middlewares/error.middleware"

const app=express();

app.use(cors());
app.use(express.json());

// router for user registration and login
app.use("/api/auth",authRouter);



// handle global error for not show internal error info to user
app.use(globalErrorHandler)

export  default app;