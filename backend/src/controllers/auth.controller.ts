import {Request,Response} from "express"
import { registerUserService } from "../service/auth.service";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export const register=async(req:Request,res:Response)=>{
    try{
        const {name,email,password,role}=req.body;
        const {user,token}=await registerUserService(name,email,password,role);
        return res.status(201).json({message:"user created succesfully...",
            user:{name:user.name,email:user.email,role:user.role},token
        });
    }catch(err:any){
        // code "P2002" means error because of @unique constraint fail
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code=="P2002")
            return res.status(400).json({message:"email already exists..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}