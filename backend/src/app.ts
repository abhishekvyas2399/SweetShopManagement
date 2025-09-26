import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"

const app=express();

app.use(cors());
app.use(express.json());

// router for user registration and login
app.use("/api/auth",authRouter);

export  default app;