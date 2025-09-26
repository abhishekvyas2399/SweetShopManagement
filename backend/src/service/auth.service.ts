import dotenv from "dotenv"
import prisma from "../prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET=process.env.JWT_SECRET as string;

// register user in DB after hash his password then create a token as well so user get access of app just after register and without login.
export const registerUserService=async (name:string,email:string,password:string,role:'CUSTOMER')=>{
    const hashedPassword=await bcrypt.hash(password,20);
    const user=await prisma.user.create({data:{name,email,password:hashedPassword,role}});
    const token=jwt.sign({user:user.name},JWT_SECRET,{expiresIn: "3h"});
    return {user,token};
}